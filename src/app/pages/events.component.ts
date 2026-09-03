import { Component, HostListener, computed, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

type Category = "Todos" | "Bodas" | "Cumpleaños" | "Fiestas privadas" | "Puestas de largo" | "Otros";
type View = "mosaic" | "list";
type EventMedia = {
  type: "image" | "video";
  src: string;
  poster?: string;
  orientation?: "portrait" | "landscape";
  alt: string;
};
type EventItem = {
  id: number;
  title: string;
  category: Exclude<Category, "Todos">;
  place: string;
  date: string;
  cover: string;
  note: string;
  services: string[];
  media: EventMedia[];
};

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./events.component.html",
})
export class EventsComponent {
  private readonly eventBase = new URL("eventos/puestas-de-largo/1/", document.baseURI).href;
  private readonly weddingBase = new URL("eventos/bodas/1/", document.baseURI).href;
  category = signal<Category>("Todos");
  view = signal<View>("mosaic");
  active = signal<EventItem | null>(null);
  activeMediaIndex = signal(0);
  activeMedia = computed(() => {
    const event = this.active();
    return event?.media[this.activeMediaIndex()] || null;
  });
  categories: Category[] = [
    "Todos",
    "Bodas",
    "Cumpleaños",
    "Fiestas privadas",
    "Otros",
  ];
  events: EventItem[] = [
    {
      id: 1,
      title: "Una noche para recordar",
      category: "Cumpleaños",
      place: "Sevilla",
      date: "2026",
      cover: `${this.eventBase}evento-puesta-de-largo-01.webp`,
      note: "Una puesta de largo, contada con sus fotos y todos los momentos en vídeo.",
      services: ["DJ", "Sonido", "Iluminación"],
      media: [
        {
          type: "image",
          src: `${this.eventBase}evento-puesta-de-largo-01.webp`,
          alt: "Invitados disfrutando de una puesta de largo en Sevilla",
        },
        ...[1, 2, 3, 4, 5, 6].map((number) => ({
          type: "video" as const,
          src: `${this.eventBase}videos/evento-puesta-de-largo-video-0${number}.mp4`,
          poster: `${this.eventBase}portadas-video/evento-puesta-de-largo-video-0${number}.webp`,
          orientation: number <= 3 ? "landscape" as const : "portrait" as const,
          alt: `Vídeo ${number} de la puesta de largo en Sevilla`,
        })),
        {
          type: "image",
          src: `${this.eventBase}evento-puesta-de-largo-02.webp`,
          alt: "Equipo de sonido e iluminación preparado para la puesta de largo",
        },
      ],
    },
    {
      id: 2,
      title: "Una boda para celebrar",
      category: "Bodas",
      place: "Sevilla",
      date: "2026",
      cover: `${this.weddingBase}evento-boda-01.webp`,
      note: "Una boda llena de momentos, música y recuerdos compartidos.",
      services: ["DJ", "Sonido", "Iluminación"],
      media: [
        ...[1, 2, 3].map((number) => ({
          type: "image" as const,
          src: `${this.weddingBase}evento-boda-0${number}.webp`,
          alt: `Foto ${number} de una boda en Sevilla`,
        })),
        ...[1, 2].map((number) => ({
          type: "video" as const,
          src: `${this.weddingBase}videos/evento-boda-video-0${number}.mp4`,
          poster: `${this.weddingBase}portadas-video/evento-boda-video-0${number}.webp`,
          orientation: "portrait" as const,
          alt: `Vídeo ${number} de una boda en Sevilla`,
        })),
      ],
    },
  ];
  visible = computed(() =>
    this.category() === "Todos"
      ? this.events
      : this.events.filter((event) => event.category === this.category()),
  );

  count(category: Category) {
    return category === "Todos"
      ? this.events.length
      : this.events.filter((event) => event.category === category).length;
  }
  photoCount(event: EventItem) {
    return event.media.filter((media) => media.type === "image").length;
  }
  videoCount(event: EventItem) {
    return event.media.filter((media) => media.type === "video").length;
  }
  open(event: EventItem) {
    this.active.set(event);
    this.activeMediaIndex.set(0);
    document.body.style.overflow = "hidden";
  }
  close() {
    this.active.set(null);
    document.body.style.overflow = "";
  }
  next() {
    this.moveMedia(1);
  }
  previous() {
    this.moveMedia(-1);
  }
  selectMedia(index: number) {
    this.activeMediaIndex.set(index);
  }
  usePosterFallback(event: Event, fallback: string) {
    const image = event.currentTarget as HTMLImageElement;
    if (image.src !== fallback) image.src = fallback;
  }
  private moveMedia(direction: number) {
    const media = this.active()?.media || [];
    if (!media.length) return;
    this.activeMediaIndex.update(
      (index) => (index + direction + media.length) % media.length,
    );
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
