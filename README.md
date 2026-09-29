# example.com — recreación en React

Reconstrucción del código fuente de https://example.com a partir del bundle de producción (Vite + React 19 + TypeScript + Tailwind v4 + react-router 7 + MDX).

## Correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

## Assets y backend

El proyecto **no incluye imágenes, fuentes ni audios** (`/assets/...`). Tampoco incluye el backend (Node/Express) que sirve:

- `GET /api/medialog/animanga/all` — lista de anime/manga
- `GET /api/medialog/stats` — estadísticas de anime/manga
- `GET /api/danbooru/favorites` — favoritos de Danbooru

En `npm run dev`, `vite.config.ts` hace de proxy de `/assets` y `/api` hacia https://example.com, así que todo se ve igual que en el sitio real. Para producción:

- Poné tus propios archivos en `public/assets/...`, respetando las mismas rutas.
- Apuntá `VITE_API_BASE` a tu backend (por ejemplo, `VITE_API_BASE=https://mi-api.com`).

## Estructura

```
src/
  App.tsx                 rutas (lazy por página)
  index.css               Tailwind + utilidades custom (blue-stripe-bg, text-white-border, font-pixel…)
  theme/                  temas de la home (Muv-Luv / Lain / Kuro) → CSS vars --home-*
  components/home/        widgets de la home (sidebar, jukebox, goals, cat album, etc.)
  components/blog/        BlogShell + blog.css
  components/medialog/    PlatformBadge
  pages/                  Home, About, Blog, BlogPost, Medialog, MedialogStats, Resources, Danbooru, NotFound
  content/blog/**.mdx     posts del blog (frontmatter: slug, title, date, category, banner, background)
  data/                   games, movies/series, resources (88x31 buttons)
  lib/                    api (fetch + cache), dates (DD/MM/YYYY), blog, age
```

Para agregar un post, creá un `.mdx` nuevo en `src/content/blog/AAAA-MM/`. Aparece solo en el blog y en la home.
