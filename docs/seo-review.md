# Revisión SEO — 3 de octubre de 2026

## Qué muestran las capturas

Search Console ha detectado un vídeo que no está en una página de visualización.
Esto afecta a su elegibilidad en resultados de vídeo; no demuestra que la web
esté desindexada ni supone por sí mismo una penalización del sitio. La captura
del informe de páginas indica que Google todavía está procesando los datos:
no permite diagnosticar errores de indexación de páginas.

La URL concreta afectada no aparece en las capturas. El código ofrece dos
explicaciones compatibles: un vídeo decorativo en portada, sin reproductor
interactivo, y vídeos de galería disponibles únicamente después de hacer clic.
Google necesita páginas donde ver un vídeo sea el objetivo principal y donde
el reproductor exista sin depender de la interacción del usuario.

## Estado inicial comprobado

- Angular ya prerenderizaba las cuatro rutas principales. No era necesario
  sustituir la aplicación ni introducir un servidor de renderizado.
- Portada y servicios devolvían HTTP 200. HTTP y el dominio con `www`
  redirigían al dominio HTTPS sin `www`.
- Existían títulos, descripciones, canonical, robots.txt y sitemap básico.
- No había páginas propias, enlaces rastreables ni datos `VideoObject` para
  los doce vídeos de galería.
- Las rutas desconocidas devolvían HTTP 404 en GitHub Pages, pero mostraban
  una copia de la portada y Angular las redirigía al inicio.
- Se precargaba la imagen de portada incluso en otras páginas.
- El contacto se repetía en varias plantillas, el formulario y el JSON-LD.

## Cambios

1. Doce páginas `/videos/<slug>/`, con un único reproductor visible en el HTML
   prerenderizado, controles, miniatura estable y contenido descriptivo.
   La portada enlaza al segundo vídeo de puesta de largo, que corresponde a
   la escena del hero, sin crear otra página duplicada.
2. Enlaces HTML a los doce vídeos desde la galería. Se conserva la galería
   interactiva de fotos y vídeos. La puesta de largo tiene su propia categoría.
3. Título, descripción, canonical, imagen social y `VideoObject` por vídeo.
   Los datos del reproductor, las rutas y el sitemap utilizan un catálogo común.
4. Sitemap general y sitemap de vídeos generados en cada build. Ambos están
   declarados en robots.txt. No se inventan fechas `lastmod` con cada compilación.
5. Datos estructurados de organización, sitio, páginas, navegación y servicios.
   Se utiliza `Organization` sin inventar dirección postal, horarios, precios o
   valoraciones para satisfacer requisitos de `LocalBusiness`.
6. Textos que explican los servicios y la cobertura Sevilla/Andalucía,
   encabezados descriptivos en servicios y galería, textos alternativos más
   concretos y preguntas frecuentes visibles en servicios.
7. Contacto centralizado: **+34 614 14 35 03**. Se actualizan botones, pie,
   formulario de presupuesto y datos estructurados.
8. Canonical, enlaces internos y navegación usan las mismas rutas con barra
   final. Las variantes con parámetros conservan el canonical de la página base.
9. Página 404 propia con `noindex,follow`, sin redirección a portada. GitHub Pages
   sirve este documento manteniendo HTTP 404 para URLs inexistentes.
10. Precarga de miniaturas solo donde se utilizan. El vídeo decorativo respeta
    la preferencia de movimiento reducido, además del ahorro de datos existente.
11. Comprobaciones automáticas del HTML generado antes de publicar en GitHub Pages.

## Metadatos de vídeo y mantenimiento

`src/app/data/videos.json` contiene las rutas, títulos, descripciones, dimensiones,
duraciones y fechas de los vídeos. Duraciones y dimensiones se extrajeron con
`ffprobe`. Las fechas `uploadDate` se basan en el primer commit que incorporó
cada archivo: son la referencia de incorporación disponible en el repositorio,
no la fecha de la celebración. Si se dispone de una fecha de publicación pública
distinta, debe sustituirse por la fecha verificada.

Para añadir un vídeo, publicar el MP4 y su miniatura en `public`, incorporarlo
al catálogo y ejecutar `npm run build` y `npm run check:seo`. La ruta, el enlace
de galería, el JSON-LD y ambos sitemaps se generan a partir del catálogo.
Los sitemaps se escriben en `dist/music-on/browser`; no se mantienen a mano
en `public`. El comando `npm start` es para desarrollo, no para comprobar los
artefactos SEO finales.

## Validación realizada

- Compilación de producción: 17 rutas prerenderizadas, incluyendo la página 404;
  16 URLs indexables en el sitemap y 12 vídeos en el sitemap de vídeos.
- `npm run check:seo`: títulos y descripciones únicos, canonical y Open Graph,
  H1 único, JSON-LD, teléfonos y enlaces de WhatsApp, existencia de imágenes y
  vídeos, enlaces internos, miniaturas, reproductores y exclusión de la página 404.
- Chrome a 1440 px y 390 px: navegación directa y con Angular, ausencia de
  desbordamiento horizontal, reproducción de vídeo horizontal y vertical,
  actualización de metadatos, parámetros del presupuesto, URL de WhatsApp y
  recuperación desde la página 404. Sin errores de JavaScript detectados.
- Revisión visual de las páginas de vídeo en escritorio y móvil.

## Seguimiento en Search Console después del despliegue

1. Enviar o volver a consultar `https://paheventos.com/sitemap.xml` y enviar
   `https://paheventos.com/video-sitemap.xml`.
2. Inspeccionar `https://paheventos.com/videos/puesta-de-largo-sevilla-2/` y
   otra página de vídeo. Ejecutar la prueba en directo, revisar el HTML renderizado
   y solicitar indexación. Comprobar también el marcado con la prueba de resultados
   enriquecidos de Google.
3. Abrir el detalle del aviso original para identificar su URL exacta. Si es la
   portada, el aviso puede mantenerse: su objetivo sigue siendo presentar el
   negocio. Las nuevas páginas son las candidatas a resultados de vídeo.
4. Cuando termine el procesamiento del informe de páginas, revisar las URLs
   excluidas y sus motivos antes de hacer más cambios.
5. Medir impresiones, clics y consultas de Sevilla/Andalucía durante las semanas
   siguientes. Estas mejoras facilitan el rastreo y la interpretación; Google
   decide si indexa las páginas y vídeos y qué posición les asigna.

No se ha accedido a la cuenta de Search Console ni a sus datos privados. Tampoco
se dispone aquí de métricas de campo de Core Web Vitals. Queda por verificar la
fuente de las cifras comerciales que ya aparecían en portada (`+50` y `4,9/5`)
y, si corresponde, enlazarla. No se han convertido en valoraciones estructuradas.

## Referencias

- [Buenas prácticas de SEO para vídeos](https://developers.google.com/search/docs/appearance/video?hl=es)
- [Datos estructurados VideoObject](https://developers.google.com/search/docs/appearance/structured-data/video?hl=es)
- [Sitemaps de vídeos](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps?hl=es)
- [Conceptos básicos de SEO para JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=es)
- [Datos estructurados de organizaciones](https://developers.google.com/search/docs/appearance/structured-data/organization?hl=es)
