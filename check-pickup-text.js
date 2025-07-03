const { chromium } = require('playwright');
const path = require('path');

async function checkPickupText() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  
  await page.waitForTimeout(1000);
  
  // Check positions
  const pickupText = await page.$('.qr-section > div:first-child');
  const qrImage = await page.$('.qr-section img');
  const qrSection = await page.$('.qr-section');
  
  if (pickupText && qrImage && qrSection) {
    const pickupBox = await pickupText.boundingBox();
    const qrBox = await qrImage.boundingBox();
    const sectionBox = await qrSection.boundingBox();
    
    console.log('QR Section dimensions:', sectionBox);
    console.log('Pickup text position:', pickupBox);
    console.log('QR image position:', qrBox);
    
    if (pickupBox.y < qrBox.y) {
      console.log('✅ Pickup text is above QR code');
    } else {
      console.log('❌ Pickup text is NOT above QR code');
    }
    
    // Check visibility
    const isVisible = await pickupText.isVisible();
    console.log('Pickup text visible:', isVisible);
  }
  
  // Take close-up screenshot of just the bottom section
  const bottomSection = await page.$('.panel.cover .bottom-section');
  if (bottomSection) {
    const box = await bottomSection.boundingBox();
    await page.screenshot({ 
      path: 'pickup-text-check.png', 
      clip: box 
    });
    console.log('Screenshot saved: pickup-text-check.png');
  }
  
  console.log('\nBrowser open for 15 seconds...');
  await page.waitForTimeout(15000);
  
  await browser.close();
}

checkPickupText();