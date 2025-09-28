import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    const { path = [] } = req.query as { path: string[] };
    const rest = { ...req.query } as Record<string, any>;
    delete (rest as any).path;

    const url = new URL(`https://api.mangadex.org/${Array.isArray(path) ? path.join('/') : path}`);
    for (const [k, v] of Object.entries(rest)) {
      if (Array.isArray(v)) v.forEach((vv) => url.searchParams.append(k, String(vv)));
      else if (v !== undefined) url.searchParams.append(k, String(v));
    }

    const upstream = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'User-Agent': 'ReadOnlyManga/1.0 (+https://read-only-manga.vercel.app)',
        'Accept': 'application/json',
      },
    });

    const contentType = upstream.headers.get('content-type') || '';
    if (!upstream.ok) {
      const text = await upstream.text();
      try { return res.status(upstream.status).json(JSON.parse(text)); }
      catch { return res.status(upstream.status).send(text); }
    }

    if (contentType.includes('application/json')) {
      const json = await upstream.json();
      return res.status(200).json(json);
    } else {
      const text = await upstream.text();
      return res.status(200).send(text);
    }
  } catch (err: any) {
    console.error('Proxy error', err);
    return res.status(500).json({ error: 'Proxy error', details: err?.message });
  }
}