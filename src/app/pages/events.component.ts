import { Component, HostListener, computed, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
type Category = "Todos" | "Bodas" | "Cumpleaños" | "Fiestas privadas" | "Otros";
type View = "mosaic" | "list";
type EventItem = {
  id: number;
  title: string;
  category: Exclude<Category, "Todos">;
  place: string;
  date: string;
  image: string;
  note: string;
  services: string[];
};
@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./events.component.html",
})
export class EventsComponent {
  private readonly imageBase = new URL("img/", document.baseURI).href;
  category = signal<Category>("Todos");
  view = signal<View>("mosaic");
  active = signal<EventItem | null>(null);
  categories: Category[] = [
    "Todos",
    "Bodas",
    "Cumpleaños",
    "Fiestas privadas",
    "Otros",
  ];
  events: EventItem[] = [
    {
      id: 2,
      title: "Una noche para recordar",
      category: "Fiestas privadas",
      place: "Sevilla",
      date: "2026",
      image: `${this.imageBase}evento-02.webp`,
      note: "Música, luces y una pista llena en una celebración muy especial.",
      services: ["DJ", "Sonido", "Iluminación"],
    },
    {
      id: 1,
      title: "La pista en su mejor momento",
      category: "Fiestas privadas",
      place: "Sevilla",
      date: "2026",
      image: `${this.imageBase}evento-01.webp`,
      note: "Una sesión pensada para acompañar la energía de cada invitado.",
      services: ["DJ", "Sonido", "Iluminación"],
    },
  ];
  visible = computed(() =>
    this.category() === "Todos"
      ? this.events
      : this.events.filter((e) => e.category === this.category()),
  );
  count(c: Category) {
    return c === "Todos"
      ? this.events.length
      : this.events.filter((e) => e.category === c).length;
  }
  open(e: EventItem) {
    this.active.set(e);
    document.body.style.overflow = "hidden";
  }
  close() {
    this.active.set(null);
    document.body.style.overflow = "";
  }
  next() {
    this.move(1);
  }
  previous() {
    this.move(-1);
  }
  move(d: number) {
    const list = this.visible();
    const i = list.findIndex((e) => e.id === this.active()?.id);
    this.active.set(list[(i + d + list.length) % list.length]);
  }
  @HostListener("document:keydown.escape") onEscape() {
    if (this.active()) this.close();
  }
  @HostListener("document:keydown.arrowright") onRight() {
    if (this.active()) this.next();
  }
  @HostListener("document:keydown.arrowleft") onLeft() {
    if (this.active()) this.previous();
  }
}
