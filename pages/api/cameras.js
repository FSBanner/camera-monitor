import { parse } from 'node-html-parser';

// Map the dot background-color inline style to a status string.
// The Fanaty admin page sets inline style="background: <hex>" on the status dot.
const COLOR_TO_STATUS = {
  '#e24b4a': 'down',
  '#e04b4a': 'down',
  '#ba7517': 'not_recording',
  '#ef9f27': 'pending',
  '#7cb342': 'uploading',
  '#639922': 'recording',
  '#185fa5': 'manual',
  '#888780': 'inactive',
  '#88878 0': 'inactive', // handle stray whitespace
};

function colorToStatus(styleStr) {
  if (!styleStr) return 'inactive';
  // Extract hex from e.g. "background: #7CB342" or "background-color:#7CB342"
  const match = styleStr.match(/#([0-9a-fA-F]{6})/);
  if (!match) return 'inactive';
  const hex = `#${match[1].toLowerCase()}`;
  return COLOR_TO_STATUS[hex] || 'inactive';
}

// Determine online: anything except 'down' and 'inactive' is considered online.
function statusToOnline(status) {
  return status !== 'down' && status !== 'inactive';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sessionCookie = process.env.CAMERA_SESSION_COOKIE;
  if (!sessionCookie) {
    return res.status(500).json({ error: 'CAMERA_SESSION_COOKIE environment variable is not set' });
  }

  let html;
  try {
    const response = await fetch('https://processing.api.fanaty.com/admin/cameras', {
      method: 'GET',
      headers: {
        Cookie: sessionCookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
    });

    if (response.status === 401 || response.status === 403) {
      return res.status(401).json({ error: 'Authentication failed. Check CAMERA_SESSION_COOKIE.' });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream API returned ${response.status}` });
    }

    html = await response.text();
  } catch (err) {
    console.error('[cameras] Fetch error:', err.message);
    return res.status(502).json({ error: 'Failed to reach Fanaty API', message: err.message });
  }

  // Parse HTML server-side with node-html-parser
  let cameras = [];
  try {
    const root = parse(html);

    // Each camera row has class "camera-row"
    const rows = root.querySelectorAll('.camera-row');

    for (const row of rows) {
      const idText = row.querySelector('.camera-id')?.text?.trim() ?? '';
      const name = row.querySelector('.camera-desc')?.text?.trim() ?? '';
      const mac = row.querySelector('.camera-mac')?.text?.trim() ?? '';
      const ip = row.querySelector('.camera-ip')?.text?.trim() ?? '';
      const version = row.querySelector('.camera-version')?.text?.trim() ?? '';
      const location = row.querySelector('.camera-location')?.text?.trim() ?? '';

      // Battery: look for a text like "85%" anywhere in the row
      const batteryEl = row.querySelector('.camera-battery') || row.querySelector('[class*="battery"]');
      let battery = null;
      if (batteryEl) {
        const batteryMatch = batteryEl.text.match(/(\d+)\s*%/);
        if (batteryMatch) battery = parseInt(batteryMatch[1], 10);
      }
      // Fallback: scan all text in the row for a battery pattern
      if (battery === null) {
        const rowText = row.text;
        const batteryMatch = rowText.match(/(\d{1,3})\s*%/);
        if (batteryMatch) battery = parseInt(batteryMatch[1], 10);
      }

      // Status dot: look for .camera-dot, read its inline style for background color
      const dotEl = row.querySelector('.camera-dot') || row.querySelector('[class*="dot"]');
      const dotStyle = dotEl?.getAttribute('style') ?? '';
      const status = colorToStatus(dotStyle);
      const online = statusToOnline(status);

      const id = parseInt(idText, 10);

      cameras.push({
        id: isNaN(id) ? idText : id,
        name: name || `Camera ${idText}`,
        location: location || ip || mac || '',
        online,
        battery,
        // Keep extra fields for the existing dashboard display
        status,
        mac,
        ip,
        version,
      });
    }

    // If .camera-row selector returned nothing, try a table-row fallback
    if (cameras.length === 0) {
      const tableRows = root.querySelectorAll('tr');
      for (const row of tableRows) {
        const cells = row.querySelectorAll('td');
        if (cells.length < 3) continue;
        // Best-effort: id, name, status from first few cells
        const idText = cells[0]?.text?.trim() ?? '';
        const name = cells[1]?.text?.trim() ?? '';
        // Look for a colored dot in any cell
        let status = 'inactive';
        for (const cell of cells) {
          const dotEl = cell.querySelector('[class*="dot"]') || cell.querySelector('[style*="background"]');
          if (dotEl) {
            status = colorToStatus(dotEl.getAttribute('style') ?? '');
            break;
          }
        }
        const id = parseInt(idText, 10);
        cameras.push({
          id: isNaN(id) ? idText : id,
          name: name || `Camera ${idText}`,
          location: cells[2]?.text?.trim() ?? '',
          online: statusToOnline(status),
          battery: null,
          status,
          mac: '',
          ip: '',
          version: '',
        });
      }
    }
  } catch (err) {
    console.error('[cameras] HTML parse error:', err.message);
    return res.status(500).json({ error: 'Failed to parse camera data', message: err.message });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');
  return res.status(200).json(cameras);
}
