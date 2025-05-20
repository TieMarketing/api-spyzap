// api/fetch_img.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Missing parameter: phone' });
  }

  const sanitized = phone.toString().replace(/\D/g, '');
  if (sanitized.length < 10) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const url = `https://whatsapp-data1.p.rapidapi.com/number/${sanitized}`;
  try {
    const apiRes = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'whatsapp-data1.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      }
    });
    const data = await apiRes.json();

    if (!apiRes.ok) {
      // repassa status e corpo de erro tal como vier do RapidAPI
      return res.status(apiRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('RapidAPI error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
