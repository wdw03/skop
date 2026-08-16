export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const queryPath = req.query.path;
  const subPath = Array.isArray(queryPath) ? queryPath.join('/') : (queryPath || '');

  // Extract any search query params like ?page=1&search=test
  const urlObj = new URL(req.url, 'http://localhost');
  urlObj.searchParams.delete('path');
  const qs = urlObj.searchParams.toString();

  const targetUrl = `http://221.132.16.77:5050/api/${subPath}${qs ? '?' + qs : ''}`;

  const headers = {};
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization;
  }
  if (req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type'];
  } else {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const fetchOptions = {
      method: req.method,
      headers
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const backendRes = await fetch(targetUrl, fetchOptions);
    const contentType = backendRes.headers.get('content-type') || '';

    res.status(backendRes.status);

    if (contentType.includes('application/json')) {
      const json = await backendRes.json();
      return res.json(json);
    } else {
      const text = await backendRes.text();
      return res.send(text);
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to connect to backend VPS server',
      error: err.message
    });
  }
}
