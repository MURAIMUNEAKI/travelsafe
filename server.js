const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint to fetch XML data
app.get('/api/safety-info', async (req, res) => {
    try {
        // Add timestamp to prevent upstream caching
        const response = await axios.get(`https://www.ezairyu.mofa.go.jp/opendata/area/newarrivalL.xml?t=${Date.now()}`);

        // Set headers to prevent browser caching
        res.set('Content-Type', 'application/xml');
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        res.send(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
