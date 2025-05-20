export default async function handler(req, res) {
  console.log('▶ RAPIDAPI_KEY is set?', !!process.env.RAPIDAPI_KEY);
  // CORS (ajuste se quiser restringir)
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
    // Sem import: usa fetch nativo
    const apiRes = await fetch(url, {
  method: 'GET',
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'whatsapp-data1.p.rapidapi.com',
    'Accept': 'application/json'
  }
});


    const data = await apiRes.json();
    // Propaga status de erro do RapidAPI, se houver
    if (!apiRes.ok) {
      return res.status(apiRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('RapidAPI error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
