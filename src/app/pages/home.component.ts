import { isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, ElementRef, PLATFORM_ID, ViewChild, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { whatsappUrl } from "../site.config";
@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./home.component.html",
})
export class HomeComponent implements AfterViewInit {
  readonly whatsapp = whatsappUrl();
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  @ViewChild("heroVideo") private heroVideo?: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    if (!this.isBrowser || !matchMedia("(min-width: 701px)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean };
    }).connection;
    if (connection?.saveData) return;
    const video = this.heroVideo?.nativeElement;
    if (!video) return;
    video.src = "/media/inicio/hero-evento.mp4";
    video.play().catch(() => undefined);
  }
}
