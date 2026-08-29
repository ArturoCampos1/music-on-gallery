import { Component, signal } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
type Theme = "azul" | "tomate" | "oliva" | "uva";
type ColorMode = "light" | "dark";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./app.component.html",
})
export class AppComponent {
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
