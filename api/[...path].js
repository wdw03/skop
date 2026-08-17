export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let subPath = '';
  if (req.query && req.query.path) {
    subPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
  } else if (req.url) {
    subPath = req.url.split('?')[0].replace(/^\/api\/?/, '');
  }

  let queryString = '';
  const qIndex = req.url ? req.url.indexOf('?') : -1;
  if (qIndex !== -1) {
    const searchParams = new URLSearchParams(req.url.slice(qIndex));
    searchParams.delete('path');
    const qs = searchParams.toString();
    if (qs) queryString = '?' + qs;
  }

  const targetUrl = `https://empleyesbackendrepo-production.up.railway.app/api/${subPath}${queryString}`;

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    let bodyData = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: bodyData
    });

    const responseText = await response.text();
    res.status(response.status);

    try {
      const json = JSON.parse(responseText);
      return res.json(json);
    } catch {
      res.setHeader('Content-Type', response.headers.get('content-type') || 'text/plain');
      return res.send(responseText);
    }
  } catch (err) {
    return res.status(502).json({
      message: 'Failed to connect to Railway backend',
      error: err.message
    });
  }
}
