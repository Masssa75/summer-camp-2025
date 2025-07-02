// Test script to send Telegram notification to Marc

async function testTelegram() {
  const TELEGRAM_BOT_TOKEN = '8180245847:AAHdyADNDPPLSrvaPDcnoAoOeNm2pTmY5e8';
  const MARC_TELEGRAM_ID = 5089502326;
  
  const message = `
🔔 <b>Test Notification</b>

Testing if Telegram notifications are working properly.

This is a test from the Summer Camp admin system.
Time: ${new Date().toLocaleString()}

If you receive this, notifications ARE working! 🎉
  `.trim();
  
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: MARC_TELEGRAM_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Test message sent successfully!');
      console.log('Response:', result);
    } else {
      console.error('❌ Failed to send message:', result);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testTelegram();