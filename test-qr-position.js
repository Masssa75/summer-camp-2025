const { chromium } = require('playwright');
const path = require('path');

async function testQRPosition() {
  console.log('Launching browser to check QR code position...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100 
  });
  
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  console.log('Loading:', filePath);
  
  await page.goto(filePath);
  await page.waitForTimeout(2000);
  
  // Highlight the QR code
  await page.evaluate(() => {
    const qr = document.querySelector('.panel.cover .qr-section img');
    if (qr) {
      qr.style.border = '2px solid red';
      console.log('QR code highlighted in red');
    }
  });
  
  // Highlight the pickup text
  await page.evaluate(() => {
    const pickup = document.querySelector('.panel.cover .pickup-text');
    if (pickup) {
      pickup.style.border = '2px solid blue';
      console.log('Pickup text highlighted in blue');
    }
  });
  
  // Get positions
  const qrImg = await page.$('.panel.cover .qr-section img');
  const pickupText = await page.$('.panel.cover .pickup-text');
  const bottomSection = await page.$('.panel.cover .bottom-section');
  
  if (qrImg && pickupText && bottomSection) {
    const qrBox = await qrImg.boundingBox();
    const pickupBox = await pickupText.boundingBox();
    const bottomBox = await bottomSection.boundingBox();
    
    console.log('\n=== POSITION ANALYSIS ===');
    console.log('Bottom section:', bottomBox);
    console.log('QR code:', qrBox);
    console.log('Pickup text:', pickupBox);
    
    // Check if QR is in bottom-right
    const qrRightEdge = qrBox.x + qrBox.width;
    const sectionRightEdge = bottomBox.x + bottomBox.width;
    const distanceFromRight = sectionRightEdge - qrRightEdge;
    
    console.log('\n=== ALIGNMENT CHECK ===');
    console.log('Distance from right edge:', distanceFromRight, 'px');
    
    if (distanceFromRight < 30) {
      console.log('✅ QR code is in bottom-right corner');
    } else {
      console.log('❌ QR code is NOT in bottom-right corner');
    }
  }
  
  // Take screenshot
  await page.screenshot({ path: 'qr-position-check.png', fullPage: true });
  console.log('\nScreenshot saved as qr-position-check.png');
  
  console.log('\nBrowser will stay open for 30 seconds for visual inspection...');
  console.log('Red border = QR code');
  console.log('Blue border = Pickup text');
  
  await page.waitForTimeout(30000);
  
  await browser.close();
}

testQRPosition();