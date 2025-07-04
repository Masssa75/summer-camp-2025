const http = require('http');
const WebSocket = require('ws');

console.log('🤖 AI Continuous Monitor Started\n');
console.log('I will check for updates every 2 seconds and summarize changes.\n');

let lastState = {
    selectedIds: new Set(),
    deletedIds: new Set(),
    messageCount: 0
};

// Connect to WebSocket for real-time updates
const ws = new WebSocket('ws://localhost:7778');

ws.on('open', () => {
    console.log('✅ Connected to WebSocket\n');
});

ws.on('message', (data) => {
    const event = JSON.parse(data.toString());
    
    if (event.type === 'ad-update') {
        console.log(`\n🔔 REALTIME UPDATE: Ad #${event.data.adId} → ${event.data.status}`);
        if (event.data.comment) {
            console.log(`   Comment: "${event.data.comment}"`);
        }
    } else if (event.type === 'new-message' && event.data.type === 'user') {
        console.log(`\n💬 USER MESSAGE: "${event.data.message}"`);
    }
});

// Also poll every 2 seconds for full state
function checkState() {
    http.get('http://localhost:7777/api/feedback', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const feedback = JSON.parse(data);
                
                // Track selected ads
                const currentSelected = new Set();
                const currentDeleted = new Set();
                
                feedback.ads.forEach(ad => {
                    if (ad.status === 'selected') currentSelected.add(ad.adId);
                    if (ad.status === 'deleted') currentDeleted.add(ad.adId);
                });
                
                // Report changes
                const newSelections = [...currentSelected].filter(id => !lastState.selectedIds.has(id));
                const newDeletions = [...currentDeleted].filter(id => !lastState.deletedIds.has(id));
                
                if (newSelections.length > 0 || newDeletions.length > 0 || feedback.messages.length > lastState.messageCount) {
                    console.log('\n📊 STATE UPDATE:');
                    console.log(`Selected: ${currentSelected.size} ads (${[...currentSelected].join(', ')})`);
                    console.log(`Deleted: ${currentDeleted.size} ads (${[...currentDeleted].join(', ')})`);
                    console.log(`Messages: ${feedback.messages.length}`);
                    
                    // AI Analysis
                    if (currentSelected.size > 0) {
                        console.log('\n🤔 AI ANALYSIS:');
                        // Analyze patterns
                        const selectedAds = feedback.ads.filter(a => a.status === 'selected');
                        const categories = {};
                        selectedAds.forEach(ad => {
                            // You'll need to map adId to category
                            console.log(`- Ad #${ad.adId} selected`);
                        });
                    }
                    
                    lastState = {
                        selectedIds: currentSelected,
                        deletedIds: currentDeleted,
                        messageCount: feedback.messages.length
                    };
                }
            } catch (e) {
                // Ignore errors
            }
        });
    }).on('error', (e) => {
        console.error('Connection error:', e.message);
    });
}

// Check every 2 seconds
setInterval(checkState, 2000);

// Initial check
setTimeout(checkState, 1000);

console.log('Monitoring your selections... (Press Ctrl+C to stop)\n');