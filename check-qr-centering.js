const { chromium } = require('playwright');
const path = require('path');

async function checkAndFixQRPosition() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Load the trifold brochure
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  
  // Wait for page to load
  await page.waitForTimeout(1000);
  
  // Get elements
  const qrImage = await page.$('.panel.cover .qr-section img');
  const bottomSection = await page.$('.panel.cover .bottom-section');
  
  if (qrImage && bottomSection) {
    const qrBox = await qrImage.boundingBox();
    const bottomBox = await bottomSection.boundingBox();
    
    console.log('Current QR position:', qrBox);
    console.log('Bottom section:', bottomBox);
    
    // Calculate centering
    const verticalCenter = (bottomBox.height - qrBox.height) / 2;
    const currentOffset = qrBox.y - bottomBox.y;
    
    console.log('\nVertical centering:');
    console.log(`Bottom section height: ${bottomBox.height}px`);
    console.log(`QR code height: ${qrBox.height}px`);
    console.log(`Should be ${verticalCenter}px from top`);
    console.log(`Currently ${currentOffset}px from top`);
    console.log(`Needs to move ${verticalCenter - currentOffset}px`);
    
    // Take screenshot
    await page.screenshot({ path: 'qr-centering-before.png', fullPage: false });
  }
  
  // Keep open for inspection
  console.log('\nBrowser will stay open for 20 seconds...');
  await page.waitForTimeout(20000);
  
  await browser.close();
}

checkAndFixQRPosition();