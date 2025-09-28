const { URL } = require('url');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extract path and query parameters
    const { path = [], ...queryParams } = req.query;
    
    // Remove the path from queryParams if it exists there
    delete queryParams.path;
    
    // Construct the MangaDex API URL properly
    const pathString = Array.isArray(path) ? path.join('/') : (path || '');
    console.log('Path extracted:', pathString);
    console.log('Query params:', queryParams);

    // Build the correct URL
    const url = new URL(`https://api.mangadex.org/${pathString}`);
    
    // Add query parameters
    Object.keys(queryParams).forEach(key => {
      if (Array.isArray(queryParams[key])) {
        queryParams[key].forEach(value => url.searchParams.append(key, value));
      } else {
        url.searchParams.append(key, queryParams[key]);
      }
    });

    console.log('Proxying request to:', url.toString());

    // Make the request to MangaDex API using fetch with required headers
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        // MangaDex requires a proper User-Agent and no Via header
        'User-Agent': 'ReadOnlyManga/1.0 (+https://read-only-manga.vercel.app)',
        'Accept': 'application/json'
      }
    });

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      const text = await response.text();
      console.error('MangaDex API error:', response.status, response.statusText);
      console.error('Body snippet:', text.slice(0, 500));
      try {
        const json = JSON.parse(text);
        return res.status(response.status).json(json);
      } catch (_) {
        return res.status(response.status).json({ error: 'Upstream error', status: response.status });
      }
    }

    if (contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Successfully fetched data from MangaDex API');
      return res.status(200).json(data);
    } else {
      const text = await response.text();
      console.warn('Unexpected content-type:', contentType);
      return res.status(200).send(text);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch from MangaDex API',
      details: error.message,
      url: req.url
    });
  }
};