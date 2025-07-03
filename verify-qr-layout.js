const { chromium } = require('playwright');
const path = require('path');

async function verifyQRLayout() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  
  await page.waitForTimeout(1000);
  
  // Focus only on the front cover panel
  const frontCover = await page.$('.panel.cover');
  
  if (frontCover) {
    // Take a screenshot of just the bottom section
    const bottomSection = await page.$('.panel.cover .bottom-section');
    if (bottomSection) {
      const box = await bottomSection.boundingBox();
      await page.screenshot({ 
        path: 'bottom-section-only.png', 
        clip: box 
      });
      console.log('Bottom section screenshot saved');
      
      // Get inner HTML to see structure
      const html = await bottomSection.innerHTML();
      console.log('\nBottom section HTML structure:');
      console.log(html.replace(/</g, '\n<').substring(0, 500));
    }
    
    // Check computed styles
    const qrSection = await page.$('.panel.cover .qr-section');
    if (qrSection) {
      const styles = await qrSection.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          flexDirection: computed.flexDirection,
          alignItems: computed.alignItems,
          justifyContent: computed.justifyContent,
          height: computed.height,
          padding: computed.padding
        };
      });
      console.log('\nQR Section computed styles:', styles);
    }
  }
  
  console.log('\nBrowser open for 20 seconds to inspect...');
  await page.waitForTimeout(20000);
  
  await browser.close();
}

verifyQRLayout();