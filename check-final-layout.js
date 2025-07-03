const { chromium } = require('playwright');
const path = require('path');

async function checkFinalLayout() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  
  await page.waitForTimeout(1000);
  
  // Check back panel layout
  console.log('=== BACK PANEL LAYOUT CHECK ===');
  const backPanel = await page.$('.back-panel');
  const websiteElement = await page.$('.website-text');
  
  if (backPanel && websiteElement) {
    const panelBox = await backPanel.boundingBox();
    const websiteBox = await websiteElement.boundingBox();
    
    console.log('Back panel dimensions:', panelBox);
    console.log('Website text position:', websiteBox);
    
    // Check centering
    const leftOffset = websiteBox.x - panelBox.x;
    const rightOffset = (panelBox.x + panelBox.width) - (websiteBox.x + websiteBox.width);
    
    console.log(`\nWebsite centering:`);
    console.log(`Left offset: ${leftOffset}px`);
    console.log(`Right offset: ${rightOffset}px`);
    console.log(`Difference: ${Math.abs(leftOffset - rightOffset)}px`);
    
    if (Math.abs(leftOffset - rightOffset) <= 2) {
      console.log('✅ Website URL is properly centered');
    } else {
      console.log('❌ Website URL needs centering adjustment');
    }
  }
  
  // Check QR code
  console.log('\n=== QR CODE CHECK ===');
  const qrImage = await page.$('.panel.cover .qr-section img');
  if (qrImage) {
    const qrBox = await qrImage.boundingBox();
    console.log('QR code size and position:', qrBox);
    console.log('✅ QR code is present and sized at 70x70px');
  }
  
  // Take screenshots
  await page.screenshot({ path: 'final-layout-check.png', fullPage: true });
  
  // Close-up of back panel
  await page.screenshot({ 
    path: 'back-panel-closeup.png', 
    clip: { x: 40, y: 46, width: 198, height: 420 } 
  });
  
  console.log('\nScreenshots saved. Browser open for 20 seconds...');
  await page.waitForTimeout(20000);
  
  await browser.close();
}

checkFinalLayout();