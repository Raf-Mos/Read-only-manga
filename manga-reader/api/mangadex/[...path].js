const https = require('https');
const { URL } = require('url');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let data = '';
      
      response.on('data', chunk => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status: response.statusCode,
            statusText: response.statusMessage,
            json: () => Promise.resolve(jsonData)
          });
        } catch (error) {
          console.error('JSON Parse Error:', error.message);
          console.error('Response data:', data.substring(0, 500)); // Log first 500 chars
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    request.on('error', (error) => {
      console.error('Request Error:', error.message);
      reject(error);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

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

    // Make the request to mangadex API using makeRequest
    const response = await makeRequest(url.toString());

    if (!response.ok) {
      console.error(`MangaDex API error: ${response.status} ${response.statusText}`);
      throw new Error(`MangaDex API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully fetched data from MangaDex API');
    res.status(200).json(data);
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