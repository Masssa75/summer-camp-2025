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
  
  // Take a screenshot to see the current state
  await page.screenshot({ path: 'qr-position-check.png', fullPage: true });
  
  // Check QR code position
  const qrCodeElement = await page.$('.qr-code');
  if (qrCodeElement) {
    const box = await qrCodeElement.boundingBox();
    console.log('QR Code Position:', box);
    
    // Check parent section position
    const qrSection = await page.$('.qr-section');
    const sectionBox = await qrSection.boundingBox();
    console.log('QR Section Position:', sectionBox);
    
    // Check bottom section position
    const bottomSection = await page.$('.bottom-section');
    const bottomBox = await bottomSection.boundingBox();
    console.log('Bottom Section Position:', bottomBox);
  }
  
  console.log('\nThe QR code SHOULD be:');
  console.log('- In the bottom-right corner of the black bottom section');
  console.log('- Small (40x40px)');
  console.log('- With "SCAN ME" text below it');
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(30000);
  await browser.close();
})();