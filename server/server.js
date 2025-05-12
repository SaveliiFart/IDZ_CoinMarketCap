const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.get("/api/crypto/:symbol", cors(), async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();

    try {
        const headers = {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY || 'a621da21-fc81-426f-810e-4420d4f1446e'
        };
    
        const priceResponse = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest", {
            params: { symbol },
            headers
        });
    
        const infoResponse = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/info", {
            params: { symbol },
            headers
        });
    
        // Тут перевірка, чи справді є дані
        const priceData = priceResponse.data.data[symbol];
        const infoData = infoResponse.data.data[symbol];
    
        if (!priceData || !infoData || Object.keys(priceResponse.data.data).length === 0 || Object.keys(infoResponse.data.data).length === 0) {
            return res.status(404).json({ error: "Cryptocurrency not found" });
        }
    
        res.json({
            name: priceData.name,
            symbol: priceData.symbol,
            price: priceData.quote.USD.price.toFixed(2),
            change24h: priceData.quote.USD.percent_change_24h.toFixed(2),
            description: infoData.description,
            logo: infoData.logo,
            website: infoData.urls.website[0] || null
        });
    
    } catch (error) {
        console.error("Error fetching data from CoinMarketCap API:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
    
});

app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});