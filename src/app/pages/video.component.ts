import { Component, computed, inject } from "@angular/core";
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
  readonly related = computed(() => videos.filter((clip) =>
    clip.event === this.video().event && clip.slug !== this.video().slug,
  ));
  readonly duration = computed(() => {
    const seconds = Math.round(this.video().durationSeconds);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  });
}
