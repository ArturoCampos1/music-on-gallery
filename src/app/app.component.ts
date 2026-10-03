import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, OnDestroy, PLATFORM_ID, computed, inject, signal } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { filter } from "rxjs";
import { SITE, whatsappUrl } from "./site.config";
import { pageStructuredData } from "./seo";
type Theme = "azul" | "tomate" | "oliva" | "uva";
type ColorMode = "light" | "dark";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./app.component.html",
})
export class AppComponent implements AfterViewInit, OnDestroy {
  readonly contact = SITE;
  readonly whatsapp = whatsappUrl();
  readonly whatsappGreeting = whatsappUrl("¡Hola pah! eventos! Quería consultaros sobre un evento.");
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private revealObserver?: IntersectionObserver;
  open = signal(false);
  theme = signal<Theme>("azul");
  mode = signal<ColorMode>("light");
  headerLogoSrc = computed(() =>
    this.mode() === "dark"
      ? "/img/brand/logo-noche-mark.webp"
      : "/img/brand/logo-dia-mark.webp",
  );
  footerLogoSrc = "/img/brand/logo-noche-full.webp";
  customColor = signal<string | null>(null);
  themes: { id: Theme; name: string; color: string }[] = [
    { id: "azul", name: "Azul verbena", color: "#2655e8" },
    { id: "tomate", name: "Tomate", color: "#ed4b34" },
    { id: "oliva", name: "Oliva", color: "#687a38" },
    { id: "uva", name: "Uva", color: "#7652a8" },
  ];
  constructor() {
    if (this.isBrowser) {
      this.theme.set((localStorage.getItem("music-on-theme") as Theme) || "azul");
      this.mode.set((localStorage.getItem("music-on-mode") as ColorMode) || "light");
      this.customColor.set(localStorage.getItem("music-on-custom-color"));
      this.document.documentElement.dataset["theme"] = this.theme();
      this.document.documentElement.dataset["mode"] = this.mode();
      const customColor = this.customColor();
      if (customColor && /^#[0-9a-f]{6}$/i.test(customColor)) {
        this.applyCustomColor(customColor);
      } else if (customColor) {
        this.customColor.set(null);
        localStorage.removeItem("music-on-custom-color");
      }
    }
    this.updateThemeColor();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSeo();
        if (this.isBrowser) requestAnimationFrame(() => this.prepareReveal());
      });
    this.updateSeo();
  }
  ngAfterViewInit() {
    if (!this.isBrowser) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    this.document.documentElement.classList.add("reveal-ready");
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
      ".choice-strip > *", ".section-intro > *", ".home-services article",
      ".gallery-teaser > *",
      ".closing > *", ".inner-title > *", ".service-catalog article",
      ".help-box > *", ".gallery-toolbar", ".gallery-count", ".gallery-item",
      ".quote-card",
    ].join(",");
    this.document.querySelectorAll<HTMLElement>(`${selector}:not(.scroll-reveal)`).forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
      this.revealObserver?.observe(element);
    });
  }
  private updateSeo() {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    const title = route.title || "DJ para bodas y eventos en Sevilla | pah! eventos";
    const description = route.data["description"] || "DJ profesional, sonido e iluminación para eventos en Sevilla.";
    const currentPath = this.router.url.split(/[?#]/)[0] || "/";
    const path = currentPath === "/" ? currentPath : `${currentPath.replace(/\/$/, "")}/`;
    const url = new URL(path, "https://paheventos.com").href;
    this.title.setTitle(title);
    this.meta.updateTag({ name: "description", content: description });
    this.meta.updateTag({ property: "og:title", content: title });
    this.meta.updateTag({ property: "og:description", content: description });
    this.meta.updateTag({ property: "og:url", content: url });
    this.meta.updateTag({ name: "twitter:title", content: title });
    this.meta.updateTag({ name: "twitter:description", content: description });
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement("link");
      canonical.rel = "canonical";
      this.document.head.appendChild(canonical);
    }
    canonical.href = url;
    const video = route.data["video"];
    const image = new URL(video?.poster || SITE.image, SITE.url).href;
    this.meta.updateTag({ name: "robots", content: route.data["noindex"]
      ? "noindex,follow" : "index,follow,max-image-preview:large,max-video-preview:-1" });
    this.meta.updateTag({ property: "og:type", content: video ? "video.other" : "website" });
    this.meta.updateTag({ property: "og:image", content: image });
    this.meta.updateTag({ property: "og:image:alt", content: video?.title || "Sonido e iluminación de pah! eventos en una puesta de largo en Sevilla" });
    this.meta.updateTag({ name: "twitter:image", content: image });
    this.meta.updateTag({ name: "twitter:image:alt", content: video?.title || "Sonido e iluminación de pah! eventos en Sevilla" });
    // Thumbnail dimensions can differ from the encoded video dimensions.
    this.meta.removeTag('property="og:image:width"');
    this.meta.removeTag('property="og:image:height"');
    let structuredData = this.document.getElementById("page-schema");
    if (!structuredData) {
      structuredData = this.document.createElement("script");
      structuredData.id = "page-schema";
      structuredData.setAttribute("type", "application/ld+json");
      this.document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(pageStructuredData(path, title, description, video, !!route.data["noindex"]))
      .replace(/</g, "\\u003c");
    let posterPreload = this.document.querySelector<HTMLLinkElement>('link[data-page-poster]');
    const poster = video?.poster || (path === "/" ? "/media/inicio/hero-evento.webp" : null);
    if (poster) {
      if (!posterPreload) {
        posterPreload = this.document.createElement("link");
        posterPreload.rel = "preload";
        posterPreload.setAttribute("as", "image");
        posterPreload.setAttribute("data-page-poster", "");
        posterPreload.setAttribute("fetchpriority", "high");
        this.document.head.appendChild(posterPreload);
      }
      posterPreload.href = poster;
    } else {
      posterPreload?.remove();
    }
  }
  changeTheme(t: Theme) {
    this.theme.set(t);
    this.customColor.set(null);
    this.document.documentElement.dataset["theme"] = t;
    this.document.documentElement.style.removeProperty("--accent");
    this.document.documentElement.style.removeProperty("--accentText");
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
    this.document.documentElement.dataset["mode"] = mode;
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
    this.document.documentElement.style.setProperty("--accent", accent);
    this.document.documentElement.style.setProperty(
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
