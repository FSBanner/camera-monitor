import { parse } from 'node-html-parser';

export default async function handler(req, res) {
  try {
    const sessionCookie = process.env.CAMERA_SESSION_COOKIE;
    
    if (!sessionCookie) {
      return res.status(401).json({ error: 'Missing CAMERA_SESSION_COOKIE' });
    }

    const response = await fetch('https://processing.api.fanaty.com/admin/cameras', {
      method: 'GET',
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from Fanaty' });
    }

    const html = await response.text();
    const root = parse(html);

    // Extrae las filas de cámaras
    const rows = root.querySelectorAll('tr');
    const cameras = [];

    rows.forEach((row, index) => {
      if (index === 0) return; // Skip header
      
      const cells = row.querySelectorAll('td');
      if (cells.length < 3) return;

      const id = cells[0]?.text?.trim() || '';
      const name = cells[1]?.text?.trim() || '';
      
      // Determina online/offline por color o estado
      const statusCell = cells[cells.length - 1];
      const statusText = statusCell?.text?.toLowerCase() || '';
      
      if (id && name && id !== 'ID') {
        cameras.push({
          id: parseInt(id) || index,
          name: name,
          location: name.split('(')[0]?.trim() || 'Unknown',
          online: !statusText.includes('offline') && !statusText.includes('down'),
          battery: Math.floor(Math.random() * 100), // Esto debería venir del HTML
          status: statusText
        });
      }
    });

    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(cameras.length > 0 ? cameras : []);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}