const { chromium } = require('playwright');
const path = require('path');

async function checkBackPanel() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  
  await page.waitForTimeout(1000);
  
  // Get back panel elements
  const backPanel = await page.$('.back-panel');
  const logo = await page.$('.back-panel .logo');
  const title = await page.$('.back-panel h2');
  const tagline = await page.$('.back-panel .tagline');
  const contactInfo = await page.$('.back-panel .contact-info');
  const website = await page.$('.back-panel p[style*="font-size: 16px"]');
  
  if (backPanel) {
    const panelBox = await backPanel.boundingBox();
    console.log('Back panel:', panelBox);
    
    if (logo) {
      const logoBox = await logo.boundingBox();
      console.log('Logo:', logoBox);
    }
    
    if (title) {
      const titleBox = await title.boundingBox();
      console.log('Title:', titleBox);
    }
    
    if (tagline) {
      const taglineBox = await tagline.boundingBox();
      console.log('Tagline:', taglineBox);
    }
    
    if (contactInfo) {
      const contactBox = await contactInfo.boundingBox();
      console.log('Contact info:', contactBox);
    }
    
    if (website) {
      const websiteBox = await website.boundingBox();
      console.log('Website:', websiteBox);
      
      // Check if truly centered
      const leftOffset = websiteBox.x - panelBox.x;
      const rightOffset = (panelBox.x + panelBox.width) - (websiteBox.x + websiteBox.width);
      console.log(`\nWebsite centering: left=${leftOffset}px, right=${rightOffset}px, diff=${Math.abs(leftOffset - rightOffset)}px`);
    }
  }
  
  // Take screenshot
  await page.screenshot({ path: 'back-panel-check.png', clip: { x: 40, y: 46, width: 198, height: 420 } });
  
  console.log('\nBrowser open for 20 seconds...');
  await page.waitForTimeout(20000);
  
  await browser.close();
}

checkBackPanel();