const { chromium } = require('playwright');
const path = require('path');

async function checkQRPosition() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  
  await page.waitForTimeout(1000);
  
  // Take screenshot of the entire front cover panel
  const coverPanel = await page.$('.panel.cover');
  if (coverPanel) {
    const coverBox = await coverPanel.boundingBox();
    await page.screenshot({ 
      path: 'cover-panel-full.png', 
      clip: coverBox 
    });
    console.log('Cover panel screenshot saved');
    
    // Get bottom section details
    const bottomSection = await page.$('.panel.cover .bottom-section');
    const qrSection = await page.$('.panel.cover .qr-section');
    const qrImage = await page.$('.panel.cover .qr-section img');
    
    if (bottomSection && qrSection && qrImage) {
      const bottomBox = await bottomSection.boundingBox();
      const qrSectionBox = await qrSection.boundingBox();
      const qrImageBox = await qrImage.boundingBox();
      
      console.log('\n=== POSITIONING ANALYSIS ===');
      console.log('Panel width:', coverBox.width);
      console.log('Panel height:', coverBox.height);
      console.log('\nBottom section:', {
        width: bottomBox.width,
        height: bottomBox.height,
        y: bottomBox.y - coverBox.y
      });
      console.log('\nQR section:', {
        width: qrSectionBox.width,
        height: qrSectionBox.height,
        x: qrSectionBox.x - coverBox.x,
        y: qrSectionBox.y - coverBox.y
      });
      console.log('\nQR image:', {
        width: qrImageBox.width,
        height: qrImageBox.height,
        x: qrImageBox.x - coverBox.x,
        y: qrImageBox.y - coverBox.y
      });
      
      // Check if QR is on the right side
      const qrRightEdge = (qrImageBox.x - coverBox.x) + qrImageBox.width;
      const panelRightEdge = coverBox.width;
      console.log('\n=== ALIGNMENT CHECK ===');
      console.log('QR right edge:', qrRightEdge);
      console.log('Panel right edge:', panelRightEdge);
      console.log('Distance from right:', panelRightEdge - qrRightEdge);
    }
  }
  
  console.log('\nBrowser open for 20 seconds...');
  await page.waitForTimeout(20000);
  
  await browser.close();
}

checkQRPosition();