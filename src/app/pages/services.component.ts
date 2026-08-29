import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./services.component.html",
})
export class ServicesComponent {
  services = [
    {
      id: "dj",
      n: "01",
      icon: "♫",
      title: "DJ profesional",
      text: "Una sesión preparada contigo y adaptada en directo a lo que ocurra en la pista.",
      includes: [
        "Reunión previa",
        "Sesión personalizada",
        "Equipo DJ profesional",
      ],
    },
    {
      id: "sonido",
      n: "02",
      icon: "◖",
      title: "Equipo de sonido",
      text: "Sonido limpio y equilibrado, configurado según el espacio y el evento.",
      includes: [
        "Altavoces y subgraves",
        "Transporte, montaje y prueba",
        "Asistencia técnica",
      ],
    },
    {
      id: "luces",
      n: "03",
      icon: "✦",
      title: "Iluminación",
      text: "Creamos una atmósfera cuidada que acompaña cada momento y transforma el espacio.",
      includes: ["Focos de color", "Efectos móviles", "Diseño de ambiente"],
    },
    {
      id: "humo",
      n: "04",
      icon: "≈",
      title: "Efectos especiales",
      text: "Recursos visuales para dar profundidad y personalidad a los momentos importantes.",
      includes: [
        "Máquina de humo",
        "Operación durante el evento",
        "Integración con iluminación",
      ],
    },
  ];
}
