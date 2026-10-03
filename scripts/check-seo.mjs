import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve("dist/music-on/browser");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const origin = "https://paheventos.com";
const videos = JSON.parse(readFileSync("src/app/data/videos.json", "utf8"));
const sitemap = read("sitemap.xml");
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
assert.equal(paths.length, 4 + videos.length);
assert.equal(new Set(paths).size, paths.length, "Duplicate sitemap URLs");
const titles = new Set();
const descriptions = new Set();
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const tagWith = (html, tag, name, value) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))].map((match) => match[0]).filter((tag) => attribute(tag, name) === value);

for (const path of paths) {
  const html = read(`${path.slice(1)}index.html`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `${path}: missing/duplicate title`);
  titles.add(title);
  const descriptionTags = tagWith(html, "meta", "name", "description");
  assert.equal(descriptionTags.length, 1, `${path}: description count`);
  const description = attribute(descriptionTags[0], "content");
  assert.ok(description && !descriptions.has(description), `${path}: missing/duplicate description`);
  descriptions.add(description);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: expected one rendered H1`);
  const canonical = tagWith(html, "link", "rel", "canonical");
  assert.equal(canonical.length, 1, `${path}: canonical count`);
  assert.equal(attribute(canonical[0], "href"), `${origin}${path}`);
  assert.equal(attribute(tagWith(html, "meta", "property", "og:url")[0], "content"), `${origin}${path}`);
  assert.ok(!attribute(tagWith(html, "meta", "name", "robots")[0], "content").includes("noindex"), `${path}: unexpectedly noindex`);
  assert.ok(html.includes("+34 614 14 35 03"), `${path}: visible contact number`);
  assert.ok(!/675[\s-]*469[\s-]*159/.test(html), `${path}: obsolete contact number`);
  const whatsappLinks = [...html.matchAll(/href="(https:\/\/api\.whatsapp\.com[^\"]+)"/g)];
  assert.ok(whatsappLinks.length >= 2, `${path}: missing contact links`);
  for (const [, href] of whatsappLinks) assert.equal(new URL(href.replaceAll("&amp;", "&")).searchParams.get("phone"), "34614143503");
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.equal(schemas.length, 1, `${path}: structured data count`);
  const graph = schemas[0]["@graph"];
  assert.equal(graph.find((node) => node["@type"] === "Organization")?.telephone, "+34614143503");
  for (const [tag] of html.matchAll(/<(?:img|video|source)\b[^>]*>/g)) {
    for (const attr of ["src", "poster"]) {
      const asset = attribute(tag, attr);
      if (asset && !/^https?:|^data:/.test(asset)) assert.ok(existsSync(resolve(root, asset.replace(/^\//, ""))), `${path}: missing ${asset}`);
    }
  }
  for (const [, href] of html.matchAll(/<a\b[^>]*href="(\/[^"?#]*)/g)) {
    if (href.endsWith("/")) assert.ok(existsSync(resolve(root, href.slice(1), "index.html")), `${path}: broken internal link ${href}`);
  }
  const video = videos.find((item) => path === `/videos/${item.slug}/`);
  if (video) {
    assert.equal((html.match(/<video\b/g) || []).length, 1, `${path}: expected one prominent video`);
    const player = html.match(/<video\b[^>]*>/)?.[0];
    assert.equal(attribute(player, "src"), video.src);
    assert.equal(attribute(player, "poster"), video.poster);
    assert.ok(/\bcontrols(?:[\s=>])/.test(player), `${path}: player controls missing`);
    const schema = graph.find((node) => node["@type"] === "VideoObject");
    assert.equal(schema.contentUrl, `${origin}${video.src}`);
    assert.equal(schema.thumbnailUrl[0], `${origin}${video.poster}`);
    assert.equal(schema.duration, `PT${video.durationSeconds}S`);
    assert.ok(Number.isFinite(Date.parse(schema.uploadDate)), `${path}: invalid publication date`);
    assert.ok(read("eventos/index.html").includes(`href="${path}"`), `${path}: no crawlable gallery link`);
  } else {
    assert.ok(!graph.some((node) => node["@type"] === "VideoObject"), `${path}: video schema on a non-watch page`);
  }
  const preloads = tagWith(html, "link", "as", "image");
  assert.equal(preloads.length, video || path === "/" ? 1 : 0, `${path}: unnecessary image preload`);
}
const videoSitemap = read("video-sitemap.xml");
assert.equal((videoSitemap.match(/<video:video>/g) || []).length, videos.length);
for (const video of videos) {
  assert.ok(videoSitemap.includes(`<loc>${origin}/videos/${video.slug}/</loc>`));
  assert.ok(videoSitemap.includes(`<video:content_loc>${origin}${video.src}</video:content_loc>`));
}
assert.match(read("404.html"), /content="noindex,follow"/);
assert.match(read("404.html"), /No encontramos esta página/);
assert.ok(!paths.includes("/404/"));
assert.match(read("robots.txt"), /Sitemap: https:\/\/paheventos.com\/video-sitemap.xml/);
console.log(`SEO checks passed: ${paths.length} prerendered pages, ${videos.length} video players, metadata, links, assets, contact details, sitemaps and 404.`);
