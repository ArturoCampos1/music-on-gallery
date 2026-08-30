import { AfterViewInit, Component, OnDestroy, inject, signal } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { filter } from "rxjs";
type Theme = "azul" | "tomate" | "oliva" | "uva";
type ColorMode = "light" | "dark";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./app.component.html",
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private revealObserver?: IntersectionObserver;
  open = signal(false);
  theme = signal<Theme>(
    (localStorage.getItem("music-on-theme") as Theme) || "azul",
  );
  mode = signal<ColorMode>(
    (localStorage.getItem("music-on-mode") as ColorMode) || "light",
  );
  customColor = signal<string | null>(localStorage.getItem("music-on-custom-color"));
  themes: { id: Theme; name: string; color: string }[] = [
    { id: "azul", name: "Azul verbena", color: "#2655e8" },
    { id: "tomate", name: "Tomate", color: "#ed4b34" },
    { id: "oliva", name: "Oliva", color: "#687a38" },
    { id: "uva", name: "Uva", color: "#7652a8" },
  ];
  constructor() {
    document.documentElement.dataset["theme"] = this.theme();
    document.documentElement.dataset["mode"] = this.mode();
    const customColor = this.customColor();
    if (customColor && /^#[0-9a-f]{6}$/i.test(customColor)) {
      this.applyCustomColor(customColor);
    } else if (customColor) {
      this.customColor.set(null);
      localStorage.removeItem("music-on-custom-color");
    }
    this.updateThemeColor();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSeo();
        requestAnimationFrame(() => this.prepareReveal());
      });
    this.updateSeo();
  }
  ngAfterViewInit() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("reveal-ready");
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          this.revealObserver?.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -7%" },
    );
    requestAnimationFrame(() => this.prepareReveal());
  }
  ngOnDestroy() {
    this.revealObserver?.disconnect();
  }
  private prepareReveal() {
    if (!this.revealObserver) return;
    const selector = [
      ".hero-copy > *", ".hero-collage", ".choice-strip > *",
      ".section-intro > *", ".home-services article", ".gallery-teaser > *",
      ".closing > *", ".inner-title > *", ".service-catalog article",
      ".help-box > *", ".gallery-toolbar", ".gallery-count", ".gallery-item",
      ".quote-card",
    ].join(",");
    document.querySelectorAll<HTMLElement>(`${selector}:not(.scroll-reveal)`).forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
      this.revealObserver?.observe(element);
    });
  }
  private updateSeo() {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    const title = route.title || "DJ para bodas y eventos en Sevilla | Music On";
    const description = route.data["description"] || "DJ profesional, sonido e iluminación para eventos en Sevilla.";
    const url = new URL(this.router.url.split("?")[0], document.baseURI).href;
    this.title.setTitle(title);
    this.meta.updateTag({ name: "description", content: description });
    this.meta.updateTag({ property: "og:title", content: title });
    this.meta.updateTag({ property: "og:description", content: description });
    this.meta.updateTag({ property: "og:url", content: url });
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }
  changeTheme(t: Theme) {
    this.theme.set(t);
    this.customColor.set(null);
    document.documentElement.dataset["theme"] = t;
    document.documentElement.style.removeProperty("--accent");
    document.documentElement.style.removeProperty("--accentText");
    localStorage.setItem("music-on-theme", t);
    localStorage.removeItem("music-on-custom-color");
    this.updateThemeColor();
  }
  changeCustomColor(color: string) {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
    this.customColor.set(color);
    localStorage.setItem("music-on-custom-color", color);
    this.applyCustomColor(color);
    this.updateThemeColor();
  }
  toggleMode() {
    const mode = this.mode() === "light" ? "dark" : "light";
    this.mode.set(mode);
    document.documentElement.dataset["mode"] = mode;
    localStorage.setItem("music-on-mode", mode);
    if (this.customColor()) this.applyCustomColor(this.customColor()!);
    this.updateThemeColor();
  }
  private updateThemeColor() {
    const lightColor = this.customColor()
      ? this.getAccessibleAccent(this.customColor()!)
      : this.themes.find((theme) => theme.id === this.theme())?.color || "#2655e8";
    this.meta.updateTag({
      name: "theme-color",
      content: this.mode() === "dark" ? "#2a2823" : lightColor,
    });
  }
  private applyCustomColor(color: string) {
    const accent = this.getAccessibleAccent(color);
    const blackContrast = this.contrastRatio(accent, "#171814");
    const whiteContrast = this.contrastRatio(accent, "#ffffff");
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty(
      "--accentText",
      blackContrast >= whiteContrast ? "#171814" : "#ffffff",
    );
  }
  private getAccessibleAccent(color: string) {
    const background = this.mode() === "dark" ? "#312e28" : "#fffdf8";
    if (this.contrastRatio(color, background) >= 4.5) return color;
    const target = this.mode() === "dark" ? "#ffffff" : "#000000";
    let low = 0;
    let high = 1;
    for (let index = 0; index < 16; index += 1) {
      const mix = (low + high) / 2;
      const candidate = this.mixColors(color, target, mix);
      if (this.contrastRatio(candidate, background) >= 4.5) high = mix;
      else low = mix;
    }
    return this.mixColors(color, target, high);
  }
  private mixColors(first: string, second: string, amount: number) {
    const a = this.hexToRgb(first);
    const b = this.hexToRgb(second);
    const channel = (index: number) => Math.round(a[index] + (b[index] - a[index]) * amount).toString(16).padStart(2, "0");
    return `#${channel(0)}${channel(1)}${channel(2)}`;
  }
  private contrastRatio(first: string, second: string) {
    const luminance = (color: string) => {
      const channels = this.hexToRgb(color).map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const [a, b] = [luminance(first), luminance(second)];
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }
  private hexToRgb(color: string) {
    return [color.slice(1, 3), color.slice(3, 5), color.slice(5, 7)].map((channel) => parseInt(channel, 16));
  }
}
