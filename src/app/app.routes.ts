import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home.component").then((module) => module.HomeComponent),
    title: "DJ para bodas y eventos en Andalucía | pah! eventos",
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
  { path: "**", redirectTo: "" },
];
