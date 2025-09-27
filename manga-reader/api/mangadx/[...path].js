const https = require('https');
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
    // Get the path from the request
    const { path, ...queryParams } = req.query;
    
    // Construct the MangaDex API URL
    const pathString = Array.isArray(path) ? path.join('/') : path || '';
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

    // Make the request to MangaDex API using fetch
    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'User-Agent': 'MangaReader/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`MangaDex API error: ${response.status} ${response.statusText}`);
      throw new Error(`MangaDex API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully fetched data from MangaDex API');
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from MangaDex API',
      details: error.message,
      url: req.url
    });
  }
};