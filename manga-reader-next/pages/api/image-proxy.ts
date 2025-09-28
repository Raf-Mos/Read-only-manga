import type { NextApiRequest, NextApiResponse } from 'next';

// Allow only MangaDex uploads host to avoid creating an open proxy
const ALLOWED_HOSTNAMES = new Set(["uploads.mangadex.org"]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = (req.query.url as string) || '';
    if (!url) {
      res.status(400).json({ error: 'Missing url parameter' });
      return;
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      res.status(400).json({ error: 'Invalid URL' });
      return;
    }

    if (!ALLOWED_HOSTNAMES.has(parsed.hostname)) {
      res.status(400).json({ error: 'Host not allowed' });
      return;
    }

    const upstream = await fetch(parsed.toString(), {
      // Send a Referer that MangaDex allows to bypass hotlink placeholder
      headers: {
        'Referer': 'https://mangadex.org/',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'User-Agent': 'ReadOnlyManga/1.0 (Vercel Serverless)'
      },
      // Edge hint; not all runtimes respect it but harmless
      cache: 'no-store',
    });

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `Upstream error ${upstream.status}` });
      return;
    }

    // Copy content type and length if present
    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const contentLength = upstream.headers.get('content-length');
    res.setHeader('Content-Type', contentType);
    if (contentLength) res.setHeader('Content-Length', contentLength);

    // Cache aggressively on the CDN; covers change rarely and have hashed filenames
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.status(200).send(buffer);
  } catch (err: any) {
    console.error('image-proxy error', err);
    res.status(500).json({ error: 'Internal error' });
  }
}
