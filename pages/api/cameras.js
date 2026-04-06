export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session cookie from environment or request
    const sessionCookie = process.env.CAMERA_SESSION_COOKIE || req.headers.cookie || '';
    
    const response = await fetch('https://processing.api.fanaty.com/admin/cameras', {
      method: 'GET',
      headers: {
        'Cookie': sessionCookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      // Allow redirects
      redirect: 'follow',
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `API returned ${response.status}` 
      });
    }

    const html = await response.text();
    
    // Set cache headers - update every 10 seconds
    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    return res.status(200).send(html);

  } catch (error) {
    console.error('Camera API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch cameras',
      message: error.message 
    });
  }
}
