import { DefaultUrlSerializer, UrlTree } from "@angular/router";

// GitHub Pages serves prerendered routes as directories. Use the same URLs
// in RouterLink, browser navigation, canonical tags and both sitemaps.
export class CanonicalUrlSerializer extends DefaultUrlSerializer {
  override serialize(tree: UrlTree): string {
    const url = super.serialize(tree);
    const suffixIndex = url.search(/[?#]/);
    const path = suffixIndex === -1 ? url : url.slice(0, suffixIndex);
    const suffix = suffixIndex === -1 ? "" : url.slice(suffixIndex);
    return `${path.endsWith("/") ? path : `${path}/`}${suffix}`;
  }
}
