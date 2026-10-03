import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="inner-title">
      <span>ERROR 404</span>
      <h1>No encontramos esta página.</h1>
      <p>Puedes volver al inicio o explorar nuestros servicios y eventos.</p>
      <div class="watch-links">
        <a routerLink="/" class="btn solid">Volver al inicio →</a>
        <a routerLink="/servicios/" class="under-link">Ver servicios →</a>
        <a routerLink="/eventos/" class="under-link">Explorar la galería →</a>
      </div>
    </section>
  `,
})
export class NotFoundComponent {}
