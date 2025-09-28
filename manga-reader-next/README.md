# MangaReader (Next.js)

A modern, responsive MangaReader built with Next.js + TypeScript + Tailwind, using a serverless API proxy for MangaDex.

## Features

- Pages: Home, Newest, Updated, Popular, Manga details, Chapter reader
- API proxy: All requests flow through `/api/mangadex/...`
- Chapter reader: keyboard navigation, zoom, fit-to-width toggle, safe z-index overlays
- Theme: light/dark toggle with persisted preference
- Tailwind styling and responsive components

## Getting started

```bash
npm install
npm run dev
# open http://localhost:3000
```

Scripts:
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – start production server (after build)

## Project structure

```
manga-reader-next/
├─ pages/                # Next.js pages router
│  ├─ index.tsx
│  ├─ newest.tsx
│  ├─ updated.tsx
│  ├─ popular.tsx
│  ├─ manga/[id].tsx
│  ├─ chapter/[id].tsx
│  ├─ api/mangadex/[...path].ts  # API proxy
│  ├─ _app.tsx
│  └─ _document.tsx              # sets favicon, html lang, etc.
├─ src/
│  ├─ components/
│  ├─ hooks/
│  ├─ services/
│  └─ types/
├─ public/
│  ├─ favicon.svg        # book icon
│  └─ sw.js              # self-unregistering service worker
├─ styles/
│  └─ globals.css
├─ tailwind.config.js
├─ postcss.config.js
├─ next.config.js
├─ tsconfig.json
└─ package.json
```

## Environment

No external API keys are required. The MangaDex API is public.

Optional env vars (create `.env.local`):

```
# Change the API base if needed (defaults to /api/mangadex on the client)
NEXT_PUBLIC_MANGADEX_PROXY=/api/mangadex/
```

## API proxy

Requests from the browser go to `/api/mangadex/...` which forwards to `https://api.mangadex.org/` on the server. This avoids CORS headaches and lets you add headers/rate limiting if needed.

## Favicon

We set a book icon in `public/favicon.svg` and reference it in `pages/_document.tsx`.

## Service worker note

This app does not use a PWA service worker by default. To suppress legacy `/sw.js` 404s from older CRA caches, `public/sw.js` is a tiny self-unregistering SW. It activates once and unregisters itself, clearing stale registrations.

## Troubleshooting

- Hydration warnings on icons/spinners: we render theme icons after mount and use a CSS-only spinner to keep SSR/CSR consistent.
- Header clicks triggering page navigation in reader: we constrain the left/right click-zones to start below headers and keep the navbar at a higher z-index.
- Document error: If you edit `pages/_document.tsx`, restart the dev server so Next.js picks it up.

## Deploy

Vercel (recommended):
1. Push to GitHub
2. Import in Vercel, set framework to Next.js
3. No build command changes needed

Static export isn’t recommended (due to serverless API routes).

## License

MIT. Manga data and images courtesy of MangaDex.
