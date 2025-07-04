const http = require('http');
const WebSocket = require('ws');

console.log('🤖 AI Auto-Responder Active\n');

// Connect to WebSocket
const ws = new WebSocket('ws://localhost:7778');

// Track state
const selections = new Map();
const deletions = new Map();
let lastResponseTime = 0;

ws.on('open', () => {
    console.log('✅ Connected - I see your changes in real-time!\n');
});

ws.on('message', (data) => {
    const event = JSON.parse(data.toString());
    
    if (event.type === 'ad-update') {
        const { adId, status } = event.data;
        
        if (status === 'selected') {
            selections.set(adId, true);
            console.log(`\n✅ Ad #${adId} SELECTED`);
            
            // Auto-respond after 3 selections
            if (selections.size === 3 && Date.now() - lastResponseTime > 30000) {
                sendAIResponse("I see you've selected 3 ads! Based on your choices, I notice a pattern. Would you like me to create variations combining these elements?");
                lastResponseTime = Date.now();
            }
        } else if (status === 'deleted') {
            deletions.set(adId, true);
            console.log(`\n❌ Ad #${adId} DELETED`);
            
            // Respond to deletions
            if (deletions.size === 2) {
                sendAIResponse("I notice you're removing certain ads. This helps me understand what doesn't work. Can you tell me what you didn't like about those?");
            }
        }
    }
    
    if (event.type === 'new-message' && event.data.type === 'user') {
        console.log(`\n💬 USER: "${event.data.message}"`);
        
        // Auto-respond to questions
        const msg = event.data.message.toLowerCase();
        if (msg.includes('?')) {
            setTimeout(() => {
                if (msg.includes('luxury') || msg.includes('relax')) {
                    sendAIResponse("For luxury-focused parents, I recommend emphasizing exclusive experiences, premium facilities, and peace of mind. Want me to create some variations?");
                } else if (msg.includes('education') || msg.includes('learn')) {
                    sendAIResponse("Educational angles work well! I can create ads highlighting Waldorf methods, nature-based learning, and cultural immersion. Shall I draft some?");
                } else {
                    sendAIResponse("Great question! Based on your selections so far, I can create targeted variations. What specific aspect would you like me to focus on?");
                }
            }, 2000);
        }
    }
});

function sendAIResponse(message) {
    const data = JSON.stringify({
        message: message,
        type: 'ai'
    });
    
    const options = {
        hostname: 'localhost',
        port: 7777,
        path: '/api/feedback/message',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };
    
    const req = http.request(options, (res) => {
        console.log(`\n🤖 AI RESPONSE SENT: "${message}"`);
    });
    
    req.on('error', (e) => {
        console.error(`Error: ${e.message}`);
    });
    
    req.write(data);
    req.end();
}

// Periodic analysis
setInterval(() => {
    if (selections.size >= 5 && Date.now() - lastResponseTime > 60000) {
        sendAIResponse(`You've selected ${selections.size} ads. I can see patterns in your preferences. Ready for me to create optimized versions based on what's working?`);
        lastResponseTime = Date.now();
    }
}, 30000);

console.log('Auto-responder ready! I will:\n');
console.log('- Track your selections and deletions');
console.log('- Respond to patterns automatically');
console.log('- Answer questions in the chat');
console.log('- Suggest improvements based on your choices\n');