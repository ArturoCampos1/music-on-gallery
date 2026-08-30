import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home.component";
import { ServicesComponent } from "./pages/services.component";
import { EventsComponent } from "./pages/events.component";
import { QuoteComponent } from "./pages/quote.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    title: "DJ para bodas y eventos en Sevilla | Music On",
    data: {
      description: "DJ profesional, sonido e iluminación para bodas, fiestas privadas y eventos en Sevilla. Producción personalizada y presupuesto por WhatsApp.",
    },
  },
  {
    path: "servicios",
    component: ServicesComponent,
    title: "DJ, sonido e iluminación para eventos en Sevilla | Music On",
    data: {
      description: "Servicios de DJ profesional, equipos de sonido, iluminación y efectos para bodas y eventos en Sevilla y alrededores.",
    },
  },
  {
    path: "eventos",
    component: EventsComponent,
    title: "Galería de bodas y fiestas en Sevilla | Music On",
    data: {
      description: "Descubre bodas, fiestas privadas y eventos reales con DJ, sonido e iluminación de Music On en Sevilla.",
    },
  },
  {
    path: "presupuesto",
    component: QuoteComponent,
    title: "Presupuesto de DJ para tu evento en Sevilla | Music On",
    data: {
      description: "Cuéntanos tu boda, cumpleaños o fiesta y solicita un presupuesto personalizado de DJ, sonido e iluminación en Sevilla.",
    },
  },
  { path: "**", redirectTo: "" },
];
