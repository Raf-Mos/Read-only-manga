## MangaReader Monorepo

This repo now contains the Next.js app in `manga-reader-next/` (the legacy CRA app was removed).

Quick links:
- App code: `manga-reader-next/`
- App README: `manga-reader-next/README.md`
- Deploy target: Vercel (recommended)

Basic commands from the app folder:

```bash
cd manga-reader-next
npm install
npm run dev
```

Git/ignore:
- See top-level `.gitignore` for Node/Next.js artifacts, env files, and OS/editor junk.

Notes:
- API calls are proxied through `pages/api/mangadex/[...path].ts` for CORS and rate limiting friendliness.
- We intentionally serve a minimal `public/sw.js` that unregisters itself to clear any stale CRA service workers and avoid dev 404 spam.
