import { Routes } from "@angular/router";
import videos from "./data/videos.json";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home.component").then((module) => module.HomeComponent),
    title: "DJ para bodas y eventos en Sevilla y Andalucía | pah! eventos",
    data: {
      description: "DJ profesional, sonido e iluminación para bodas, fiestas privadas y eventos en Sevilla y toda Andalucía. Presupuesto por WhatsApp.",
    },
  },
  {
    path: "servicios",
    loadComponent: () =>
      import("./pages/services.component").then((module) => module.ServicesComponent),
    title: "DJ, sonido e iluminación en Andalucía | pah! eventos",
    data: {
      description: "Servicios de DJ profesional, equipos de sonido, iluminación y efectos para bodas y eventos por toda Andalucía.",
    },
  },
  {
    path: "eventos",
    loadComponent: () =>
      import("./pages/events.component").then((module) => module.EventsComponent),
    title: "Galería de bodas y fiestas en Andalucía | pah! eventos",
    data: {
      description: "Descubre bodas, fiestas privadas y eventos reales con DJ, sonido e iluminación de pah! eventos por toda Andalucía.",
    },
  },
  {
    path: "presupuesto",
    loadComponent: () =>
      import("./pages/quote.component").then((module) => module.QuoteComponent),
    title: "Presupuesto de DJ para eventos en Andalucía | pah! eventos",
    data: {
      description: "Cuéntanos tu boda, cumpleaños o fiesta y solicita un presupuesto personalizado de DJ, sonido e iluminación en Andalucía.",
    },
  },
  ...videos.map((video) => ({
    path: `videos/${video.slug}`,
    loadComponent: () => import("./pages/video.component").then((module) => module.VideoComponent),
    title: `${video.title} | pah! eventos`,
    data: { description: video.description, video },
  })),
  {
    path: "404",
    loadComponent: () => import("./pages/not-found.component").then((module) => module.NotFoundComponent),
    title: "Página no encontrada | pah! eventos",
    data: { noindex: true, description: "La página que buscas no existe. Descubre los servicios y eventos de pah! eventos." },
  },
  {
    path: "**",
    loadComponent: () => import("./pages/not-found.component").then((module) => module.NotFoundComponent),
    title: "Página no encontrada | pah! eventos",
    data: { noindex: true, description: "La página que buscas no existe. Descubre los servicios y eventos de pah! eventos." },
  },
];
