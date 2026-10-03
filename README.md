# pah! eventos

```powershell
npm install
npm start
```

Para compilar las páginas prerenderizadas, generar los sitemaps y comprobar el SEO:

```powershell
npm run build
npm run check:seo
```

Los cambios en `main` se publican en GitHub Pages tras superar estas comprobaciones.
El contacto se mantiene en `src/app/site.config.ts` y los vídeos en
`src/app/data/videos.json`.

[Análisis SEO y seguimiento en Search Console](docs/seo-review.md).
