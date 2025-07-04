const WebSocket = require('ws');
const http = require('http');

console.log('🚀 Starting feedback monitor...\n');

// Connect to WebSocket
const ws = new WebSocket('ws://localhost:9055');

// Track feedback
let lastUpdate = null;
let selectedAds = new Set();
let messages = [];

ws.on('open', () => {
    console.log('✅ Connected to feedback server!');
    console.log('👀 Watching for your selections and messages...\n');
});

ws.on('message', (data) => {
    const event = JSON.parse(data.toString());
    
    switch(event.type) {
        case 'initial-state':
            // Process initial state
            if (event.data.ads) {
                event.data.ads.forEach(ad => {
                    if (ad.status === 'selected') {
                        selectedAds.add(ad.adId);
                    }
                });
            }
            console.log(`📊 Current state: ${selectedAds.size} ads selected`);
            break;
            
        case 'ad-update':
            // Handle ad selection changes
            const { adId, status, comment } = event.data;
            
            if (status === 'selected') {
                selectedAds.add(adId);
                console.log(`\n✅ Ad #${adId} SELECTED`);
            } else if (status === 'unselected') {
                selectedAds.delete(adId);
                console.log(`\n❌ Ad #${adId} UNSELECTED`);
            }
            
            if (comment) {
                console.log(`💬 Comment on Ad #${adId}: "${comment}"`);
            }
            
            console.log(`📊 Total selected: ${selectedAds.size}`);
            break;
            
        case 'new-message':
            // Handle chat messages
            if (event.data.type === 'user') {
                console.log(`\n💬 USER: ${event.data.message}`);
                messages.push(event.data);
            }
            break;
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
});

ws.on('close', () => {
    console.log('\n⚠️  Disconnected from server');
    process.exit(1);
});

// Also poll REST API periodically for full state
function checkFullState() {
    http.get('http://localhost:8080/api/feedback', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const feedback = JSON.parse(data);
                
                // Show summary
                console.log('\n📋 Full State Summary:');
                console.log(`- Selected ads: ${feedback.ads.filter(a => a.status === 'selected').map(a => '#' + a.adId).join(', ')}`);
                console.log(`- Total messages: ${feedback.messages.length}`);
                console.log(`- Last update: ${new Date(feedback.lastUpdate).toLocaleTimeString()}`);
                
                // Show recent comments
                const recentComments = feedback.ads
                    .filter(a => a.comments && a.comments.length > 0)
                    .flatMap(a => a.comments.map(c => ({adId: a.adId, ...c})))
                    .sort((a, b) => new Date(b.time) - new Date(a.time))
                    .slice(0, 3);
                    
                if (recentComments.length > 0) {
                    console.log('\n💭 Recent Comments:');
                    recentComments.forEach(c => {
                        console.log(`  Ad #${c.adId}: "${c.text}"`);
                    });
                }
            } catch (e) {
                // Ignore parse errors
            }
        });
    }).on('error', () => {
        // Server might not be ready yet
    });
}

// Check full state every 30 seconds
setInterval(checkFullState, 30000);

// Initial check after 2 seconds
setTimeout(checkFullState, 2000);

console.log('\n📝 Commands you can use:');
console.log('- Select ads in the browser');
console.log('- Type messages in the chat');
console.log('- I\'ll see everything here in real-time!');
console.log('\nPress Ctrl+C to stop monitoring\n');