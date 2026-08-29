import { AfterViewInit, Component, OnDestroy, inject, signal } from "@angular/core";
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
  private revealObserver?: IntersectionObserver;
  open = signal(false);
  theme = signal<Theme>(
    (localStorage.getItem("music-on-theme") as Theme) || "azul",
  );
  mode = signal<ColorMode>(
    (localStorage.getItem("music-on-mode") as ColorMode) || "light",
  );
  themes: { id: Theme; name: string; color: string }[] = [
    { id: "azul", name: "Azul verbena", color: "#2655e8" },
    { id: "tomate", name: "Tomate", color: "#ed4b34" },
    { id: "oliva", name: "Oliva", color: "#687a38" },
    { id: "uva", name: "Uva", color: "#7652a8" },
  ];
  constructor() {
    document.documentElement.dataset["theme"] = this.theme();
    document.documentElement.dataset["mode"] = this.mode();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => requestAnimationFrame(() => this.prepareReveal()));
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
  changeTheme(t: Theme) {
    this.theme.set(t);
    document.documentElement.dataset["theme"] = t;
    localStorage.setItem("music-on-theme", t);
  }
  toggleMode() {
    const mode = this.mode() === "light" ? "dark" : "light";
    this.mode.set(mode);
    document.documentElement.dataset["mode"] = mode;
    localStorage.setItem("music-on-mode", mode);
  }
}
