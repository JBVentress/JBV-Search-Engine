// server.js
const express = require('express');
const cors = require('cors');
const scraper = require('./scraper');

const app = express();
app.use(cors());
app.use(express.static('public'));

app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing query' });

  try {
    const results = await scraper(q);
    res.json({ results });
  } catch (e) {
    console.error('❌ Search failed:', e);
    res.status(500).json({ error: 'Search failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
