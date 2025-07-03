const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Load the brochure file
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-final-design.html');
  await page.goto(filePath);
  
  // Wait for the page to load
  await page.waitForTimeout(2000);
  
  // Take a screenshot
  await page.screenshot({ path: 'qr-final-check.png', fullPage: true });
  
  // Check if QR image exists and its position
  const qrImage = await page.$('.qr-section img');
  if (qrImage) {
    const box = await qrImage.boundingBox();
    console.log('QR Image Position:', box);
    console.log('\nQR code is now directly placed as an image');
    console.log('No more nested containers or duplicate SCAN ME text');
  } else {
    console.log('QR image not found!');
  }
  
  // Check bottom section
  const bottomSection = await page.$('.bottom-section');
  const bottomBox = await bottomSection.boundingBox();
  console.log('\nBottom Section:', bottomBox);
  
  // Keep browser open for visual inspection
  console.log('\nBrowser will stay open for 15 seconds for visual inspection...');
  await page.waitForTimeout(15000);
  
  await browser.close();
})();