const { chromium } = require('playwright');
const path = require('path');

async function checkBothIssues() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  
  await page.waitForTimeout(1000);
  
  // Check QR code position
  console.log('=== QR CODE CHECK ===');
  const qrImage = await page.$('.panel.cover .qr-section img');
  const bottomSection = await page.$('.panel.cover .bottom-section');
  
  if (qrImage && bottomSection) {
    const qrBox = await qrImage.boundingBox();
    const bottomBox = await bottomSection.boundingBox();
    
    console.log('QR Image position:', qrBox);
    console.log('Bottom section:', bottomBox);
    console.log('QR relative position: x=' + (qrBox.x - bottomBox.x) + ', y=' + (qrBox.y - bottomBox.y));
  }
  
  // Check website URL on green panel
  console.log('\n=== WEBSITE URL CHECK ===');
  const websiteElement = await page.$('.back-panel .website');
  const backPanel = await page.$('.back-panel');
  
  if (websiteElement && backPanel) {
    const websiteBox = await websiteElement.boundingBox();
    const panelBox = await backPanel.boundingBox();
    
    console.log('Website URL position:', websiteBox);
    console.log('Back panel:', panelBox);
    
    const leftOffset = websiteBox.x - panelBox.x;
    const rightOffset = (panelBox.x + panelBox.width) - (websiteBox.x + websiteBox.width);
    
    console.log(`Website URL centering:`);
    console.log(`Left offset: ${leftOffset}px`);
    console.log(`Right offset: ${rightOffset}px`);
    console.log(`Difference: ${Math.abs(leftOffset - rightOffset)}px`);
    
    if (Math.abs(leftOffset - rightOffset) > 2) {
      console.log('NOT CENTERED - needs adjustment');
    } else {
      console.log('Properly centered');
    }
  }
  
  // Take screenshots
  await page.screenshot({ path: 'issues-check.png', fullPage: true });
  
  console.log('\nBrowser open for 20 seconds...');
  await page.waitForTimeout(20000);
  
  await browser.close();
}

checkBothIssues();