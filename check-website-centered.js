const { chromium } = require('playwright');
const path = require('path');

async function checkWebsiteCentering() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  
  await page.waitForTimeout(1000);
  
  // Check website URL centering
  const websiteElement = await page.$('.back-panel p');
  const backPanel = await page.$('.back-panel');
  
  if (websiteElement && backPanel) {
    const websiteBox = await websiteElement.boundingBox();
    const panelBox = await backPanel.boundingBox();
    
    console.log('Website URL element:', websiteBox);
    console.log('Back panel:', panelBox);
    
    const leftOffset = websiteBox.x - panelBox.x;
    const rightOffset = (panelBox.x + panelBox.width) - (websiteBox.x + websiteBox.width);
    
    console.log(`\nCentering analysis:`);
    console.log(`Panel width: ${panelBox.width}px`);
    console.log(`Website width: ${websiteBox.width}px`);
    console.log(`Left offset: ${leftOffset}px`);
    console.log(`Right offset: ${rightOffset}px`);
    console.log(`Difference: ${Math.abs(leftOffset - rightOffset)}px`);
    
    if (Math.abs(leftOffset - rightOffset) > 2) {
      console.log('\n❌ NOT CENTERED - needs adjustment');
      console.log(`Move ${(leftOffset - rightOffset) / 2}px to the right`);
    } else {
      console.log('\n✅ Properly centered');
    }
    
    // Visual check
    const centerX = panelBox.x + (panelBox.width / 2);
    const websiteCenterX = websiteBox.x + (websiteBox.width / 2);
    console.log(`\nPanel center: ${centerX}`);
    console.log(`Website center: ${websiteCenterX}`);
    console.log(`Offset from center: ${Math.abs(centerX - websiteCenterX)}px`);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'website-centering.png', clip: { x: 40, y: 46, width: 198, height: 420 } });
  
  console.log('\nBrowser open for 20 seconds...');
  await page.waitForTimeout(20000);
  
  await browser.close();
}

checkWebsiteCentering();