const express = require('express');
const WebSocket = require('ws');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Enable CORS for the frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

// Store feedback in memory (could use a database in production)
let feedbackData = {
    ads: [],
    messages: [],
    lastUpdate: new Date().toISOString()
};

// Load initial ad data
async function loadInitialData() {
    try {
        const data = await fs.readFile('feedback-data.json', 'utf8');
        feedbackData = JSON.parse(data);
    } catch (error) {
        console.log('No existing feedback data, starting fresh');
    }
}

// Save feedback data
async function saveFeedbackData() {
    await fs.writeFile('feedback-data.json', JSON.stringify(feedbackData, null, 2));
}

// REST API endpoints
app.get('/api/feedback', (req, res) => {
    res.json(feedbackData);
});

app.post('/api/feedback/ad', async (req, res) => {
    const { adId, status, comment } = req.body;
    
    // Update ad feedback
    const existingAd = feedbackData.ads.find(a => a.adId === adId);
    if (existingAd) {
        existingAd.status = status;
        if (comment) existingAd.comments.push({ text: comment, time: new Date().toISOString() });
    } else {
        feedbackData.ads.push({
            adId,
            status,
            comments: comment ? [{ text: comment, time: new Date().toISOString() }] : []
        });
    }
    
    feedbackData.lastUpdate = new Date().toISOString();
    await saveFeedbackData();
    
    // Broadcast update to all WebSocket clients
    broadcast({ type: 'ad-update', data: req.body });
    
    res.json({ success: true });
});

app.post('/api/feedback/message', async (req, res) => {
    const { message, type = 'user' } = req.body;
    
    const newMessage = {
        id: Date.now(),
        message,
        type,
        time: new Date().toISOString()
    };
    
    feedbackData.messages.push(newMessage);
    feedbackData.lastUpdate = new Date().toISOString();
    await saveFeedbackData();
    
    // Broadcast to WebSocket clients
    broadcast({ type: 'new-message', data: newMessage });
    
    res.json({ success: true });
});

// WebSocket server
const wss = new WebSocket.Server({ port: 9055 });

const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New WebSocket client connected');
    
    // Send current state to new client
    ws.send(JSON.stringify({
        type: 'initial-state',
        data: feedbackData
    }));
    
    ws.on('close', () => {
        clients.delete(ws);
        console.log('WebSocket client disconnected');
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

function broadcast(data) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Initialize and start server
loadInitialData().then(() => {
    app.listen(port, () => {
        console.log(`Feedback server running at http://localhost:${port}`);
        console.log(`WebSocket server running on port 9055`);
        console.log('\nTo use:');
        console.log('1. Open interactive-ad-selector-realtime.html in your browser');
        console.log('2. I can poll the /api/feedback endpoint to see your selections');
        console.log('3. Or connect via WebSocket for instant updates');
    });
});