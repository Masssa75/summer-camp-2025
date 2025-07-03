const { chromium } = require('playwright');
const path = require('path');

async function debugQRPosition() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  await page.waitForTimeout(1000);
  
  // Debug the qr-section element
  const qrSection = await page.$('.panel.cover .qr-section');
  if (qrSection) {
    // Check computed styles
    const styles = await qrSection.evaluate(el => {
      const computed = window.getComputedStyle(el);
      const parent = el.parentElement;
      const parentComputed = window.getComputedStyle(parent);
      return {
        qrSection: {
          display: computed.display,
          marginLeft: computed.marginLeft,
          alignItems: computed.alignItems,
          position: computed.position,
          width: el.offsetWidth,
          innerHTML: el.innerHTML.substring(0, 200)
        },
        parent: {
          display: parentComputed.display,
          justifyContent: parentComputed.justifyContent,
          width: parent.offsetWidth
        }
      };
    });
    
    console.log('QR Section styles:', JSON.stringify(styles, null, 2));
    
    // Check if QR image is inside qr-section
    const qrInSection = await page.$('.panel.cover .qr-section img');
    console.log('QR image inside qr-section:', !!qrInSection);
    
    // Highlight elements
    await page.evaluate(() => {
      const section = document.querySelector('.panel.cover .qr-section');
      const img = document.querySelector('.panel.cover .qr-section img');
      const bottom = document.querySelector('.panel.cover .bottom-section');
      
      if (section) section.style.border = '3px solid yellow';
      if (img) img.style.border = '3px solid red';
      if (bottom) bottom.style.outline = '3px solid green';
    });
  }
  
  console.log('\nYellow = qr-section container');
  console.log('Red = QR image');
  console.log('Green = bottom section');
  
  await page.screenshot({ path: 'debug-qr-position.png', fullPage: true });
  
  console.log('\nBrowser open for 30 seconds...');
  await page.waitForTimeout(30000);
  
  await browser.close();
}

debugQRPosition();