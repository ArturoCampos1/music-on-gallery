import { ApplicationConfig } from "@angular/core";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";
import { provideRouter, UrlSerializer, withInMemoryScrolling } from "@angular/router";
import { routes } from "./app.routes";
import { CanonicalUrlSerializer } from "./canonical-url.serializer";

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: UrlSerializer, useClass: CanonicalUrlSerializer },
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: "top" }),
    ),
    provideClientHydration(withEventReplay()),
  ],
};
