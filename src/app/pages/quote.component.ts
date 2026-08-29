import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
type Service = { id: string; name: string; description: string; icon: string };
@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: "./quote.component.html",
})
export class QuoteComponent {
  route = inject(ActivatedRoute);
  step = signal(1);
  eventType = signal(this.route.snapshot.queryParamMap.get("tipo") || "");
  selected = signal<string[]>(
    this.route.snapshot.queryParamMap.get("servicio")
      ? [this.route.snapshot.queryParamMap.get("servicio")!]
      : [],
  );
  name = "";
  phone = "";

  eventTypes = [
    { name: "Boda", icon: "○", note: "Ceremonia, convite o fiesta" },
    { name: "Cumpleaños", icon: "✳", note: "Una celebración a tu medida" },
    { name: "Fiesta privada", icon: "⌁", note: "En casa, hacienda o local" },
    { name: "Otro evento", icon: "□", note: "Cualquier otro formato" },
  ];
  services: Service[] = [
    {
      id: "dj",
      name: "DJ profesional",
      description: "Sesión y mezcla en directo",
      icon: "♫",
    },
    {
      id: "sonido",
      name: "Equipo de sonido",
      description: "Montaje y asistencia técnica",
      icon: "◖",
    },
    {
      id: "luces",
      name: "Iluminación",
      description: "Diseño de ambiente",
      icon: "✦",
    },
    {
      id: "humo",
      name: "Efectos especiales",
      description: "Recursos visuales",
      icon: "≈",
    },
    {
      id: "ayuda",
      name: "Necesito asesoramiento",
      description: "Ayudadme a elegir",
      icon: "?",
    },
  ];
  toggle(id: string) {
    this.selected.update((a) =>
      a.includes(id) ? a.filter((x) => x !== id) : [...a, id],
    );
  }
  send() {
    if (!this.name) return;
    const chosen = this.selected().length
      ? this.services
          .filter((s) => this.selected().includes(s.id))
          .map((s) => s.name)
          .join(", ")
      : "Necesito asesoramiento";
    const lines = [
      `¡Hola Music On! Soy ${this.name}.`,
      `Quiero consultar sobre: ${this.eventType()}.`,
      this.phone ? `Mi teléfono: ${this.phone}.` : "",
      `Me interesa: ${chosen}.`,
      `¿Podemos hablar de los detalles?`,
    ].filter(Boolean);
    window.open(
      `https://api.whatsapp.com/send?phone=34600613387&text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
    );
  }
}
