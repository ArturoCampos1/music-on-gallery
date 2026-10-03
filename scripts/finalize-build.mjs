import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve("dist/music-on/browser");
const videos = JSON.parse(readFileSync("src/app/data/videos.json", "utf8"));
const origin = "https://paheventos.com";
const escapeXml = (value) => String(value).replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]);

// No automatic lastmod: a build date is not necessarily a content update.
const paths = ["/", "/servicios/", "/eventos/", "/presupuesto/", ...videos.map((video) => `/videos/${video.slug}/`)];
writeFileSync(resolve(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n")}
</urlset>\n`);

writeFileSync(resolve(root, "video-sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videos.map((video) => `  <url>
    <loc>${origin}/videos/${video.slug}/</loc>
    <video:video>
      <video:thumbnail_loc>${origin}${escapeXml(video.poster)}</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:content_loc>${origin}${escapeXml(video.src)}</video:content_loc>
      <video:duration>${Math.round(video.durationSeconds)}</video:duration>
      <video:publication_date>${video.uploadDate}</video:publication_date>
    </video:video>
  </url>`).join("\n")}
</urlset>\n`);

// GitHub Pages keeps the 404 status while serving our prerendered error page.
copyFileSync(resolve(root, "404/index.html"), resolve(root, "404.html"));
console.log(`Generated sitemaps for ${paths.length} pages and ${videos.length} videos; prepared 404.html.`);
