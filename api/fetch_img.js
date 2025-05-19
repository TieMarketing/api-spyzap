export default async function handler(req, res) {
  // 1) CORS (ajuste o * para seu domínio em produção)
  res.setHeader('Access-Control-Allow-Origin', 'https://descubra-tudospy.online/');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;
  try {
    body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(JSON.parse(data)));
      req.on('error', reject);
    });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const phone = String(body.phone || '').replace(/\D/g, '');
  if (phone.length < 10) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  if (!RAPIDAPI_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const apiUrl = `https://whatsapp-data1.p.rapidapi.com/number/${phone}`;
  try {
    const apiRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'whatsapp-data1.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('RapidAPI error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
