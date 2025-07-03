const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Load the TRIFOLD brochure file
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  console.log('Loading:', filePath);
  await page.goto(filePath);
  
  // Wait for the page to load
  await page.waitForTimeout(2000);
  
  // Take a screenshot
  await page.screenshot({ path: 'trifold-qr-check.png', fullPage: true });
  
  // Find the QR image in the front cover panel
  const qrImage = await page.$('.panel.cover .qr-section img');
  if (qrImage) {
    const box = await qrImage.boundingBox();
    console.log('\nQR Image in Front Cover Panel:');
    console.log('Position:', box);
    console.log(`Location: x=${box.x}, y=${box.y}`);
    console.log(`Size: ${box.width}x${box.height}px`);
    
    // Check parent elements
    const qrSection = await page.$('.panel.cover .qr-section');
    const sectionBox = await qrSection.boundingBox();
    console.log('\nQR Section container:', sectionBox);
    
    const bottomSection = await page.$('.panel.cover .bottom-section');
    const bottomBox = await bottomSection.boundingBox();
    console.log('\nBottom Section (black area):', bottomBox);
    
    // Calculate position relative to bottom section
    const relativeX = box.x - bottomBox.x;
    const relativeY = box.y - bottomBox.y;
    console.log(`\nQR position relative to bottom section: x=${relativeX}, y=${relativeY}`);
    console.log(`Bottom section width: ${bottomBox.width}, QR is ${bottomBox.width - relativeX - box.width}px from right edge`);
    
  } else {
    console.log('QR image not found in front cover panel!');
  }
  
  // Keep browser open for visual inspection
  console.log('\n\nBrowser will stay open for 20 seconds for visual inspection...');
  console.log('Check the FRONT COVER panel (3rd panel in the outside view)');
  await page.waitForTimeout(20000);
  
  await browser.close();
})();