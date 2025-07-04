const http = require('http');

// Helper to send messages to the chat
function sendAIMessage(message) {
    const data = JSON.stringify({
        message: message,
        type: 'ai'
    });
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/feedback/message',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };
    
    const req = http.request(options, (res) => {
        console.log(`✅ Sent: "${message}"`);
    });
    
    req.on('error', (e) => {
        console.error(`❌ Error sending message: ${e.message}`);
    });
    
    req.write(data);
    req.end();
}

// Example: Generate improved ad variations based on selections
function generateImprovedAd(adId, category) {
    const improvements = {
        luxury: [
            "Based on your selection, here's a refined version focusing on exclusive experiences:",
            "Premium Childcare While You Indulge - Our 5-star facility offers gourmet organic meals, certified Waldorf educators, and a 1:4 teacher ratio. Your peace of mind: priceless.",
            "Headline: Elevate Your Phuket Experience",
            "CTA: Reserve Your Exclusive Spot"
        ],
        educational: [
            "I see you like the educational angle! Here's an enhanced version:",
            "Transform vacation into education: Daily Thai language immersion, marine biology at our aquarium, traditional arts with local masters. Harvard-quality enrichment in paradise.",
            "Headline: Where Vacation Meets Ivy League Learning",
            "CTA: Explore Our Curriculum"
        ],
        problem: [
            "Great choice! Let me strengthen this problem/solution approach:",
            "The #1 parent complaint in Phuket? 'What do we do with the kids?' We solved it. Professional care, instant booking, real-time updates. Your vacation starts now.",
            "Headline: Finally, Parents Can Vacation Too",
            "CTA: Book Today, Relax Tomorrow"
        ]
    };
    
    return improvements[category] || improvements.luxury;
}

// Export functions for external use
module.exports = {
    sendAIMessage,
    generateImprovedAd
};

// If run directly, send a test message
if (require.main === module) {
    sendAIMessage("I'm here and watching your selections! Pick your favorites and I'll create improved versions.");
}