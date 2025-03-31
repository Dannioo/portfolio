require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API route
app.get('/api/data', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default; // Dynamic import for CommonJS
        const username = process.env.API_USERNAME;
        const password = process.env.API_PASSWORD;
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

        const response = await fetch("https://fedskillstest.coalitiontechnologies.workers.dev", {
            method: "GET",
            headers: { "Authorization": authHeader },
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching API:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
