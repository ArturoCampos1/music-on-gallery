import { SITE } from "./site.config";
import videos from "./data/videos.json";

export function pageStructuredData(path: string, title: string, description: string, video?: (typeof videos)[number], noindex = false) {
  if (noindex) return { "@context": "https://schema.org", "@graph": [] };
  const url = `${SITE.url}${path}`;
  const businessId = `${SITE.url}/#business`;
  const websiteId = `${SITE.url}/#website`;
  const pageId = `${url}#webpage`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization", "@id": businessId,
      name: SITE.name, url: `${SITE.url}/`, telephone: SITE.phone, email: SITE.email,
      logo: `${SITE.url}/img/brand/logo-dia-full.webp`, image: `${SITE.url}${SITE.image}`,
      description: "DJ profesional, sonido e iluminación para bodas, fiestas privadas y eventos. Con base en Sevilla y disponibles en toda Andalucía.",
      areaServed: { "@type": "AdministrativeArea", name: "Andalucía" },
      contactPoint: { "@type": "ContactPoint", telephone: SITE.phone, contactType: "customer service", availableLanguage: "es" },
    },
    { "@type": "WebSite", "@id": websiteId, url: `${SITE.url}/`, name: SITE.name, inLanguage: "es", publisher: { "@id": businessId } },
    {
      "@type": video ? "ItemPage" : path === "/eventos/" ? "CollectionPage" : path === "/presupuesto/" ? "ContactPage" : "WebPage",
      "@id": pageId, url, name: title, description, inLanguage: "es",
      isPartOf: { "@id": websiteId }, about: { "@id": businessId },
      ...(path !== "/" ? { breadcrumb: { "@id": `${url}#breadcrumbs` } } : {}),
      ...(video ? { mainEntity: { "@id": `${url}#video` } } : {}),
    },
  ];
  if (path !== "/") {
    const crumbs = [{ name: "Inicio", item: `${SITE.url}/` }];
    if (video) crumbs.push({ name: "Galería", item: `${SITE.url}/eventos/` });
    crumbs.push({ name: video?.title || title.split(" | ")[0], item: url });
    graph.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumbs`, itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, ...crumb })) });
  }
  if (video) {
    graph.push({
      "@type": "VideoObject", "@id": `${url}#video`, name: video.title, description: video.description,
      thumbnailUrl: [`${SITE.url}${video.poster}`], contentUrl: `${SITE.url}${video.src}`,
      uploadDate: video.uploadDate, duration: `PT${video.durationSeconds}S`, inLanguage: "es",
      publisher: { "@id": businessId }, mainEntityOfPage: { "@id": pageId },
    });
  }
  if (path === "/servicios/") {
    for (const name of ["DJ profesional", "Equipo de sonido", "Iluminación", "Efectos especiales"]) {
      graph.push({ "@type": "Service", name, serviceType: name, url,
        provider: { "@id": businessId }, areaServed: { "@type": "AdministrativeArea", name: "Andalucía" } });
    }
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
