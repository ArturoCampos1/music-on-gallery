import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import videos from "../data/videos.json";

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./video.component.html",
})
export class VideoComponent {
  private readonly route = inject(ActivatedRoute);
  readonly video = toSignal(
    this.route.data.pipe(map((data) => data["video"] as (typeof videos)[number])),
    { requireSync: true },
  );
}
