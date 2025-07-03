const { chromium } = require('playwright');
const path = require('path');

async function findAllQR() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  await page.waitForTimeout(1000);
  
  // Find ALL QR code images
  const allQRImages = await page.$$('img[src*="QR"]');
  console.log(`Found ${allQRImages.length} QR code images`);
  
  // Get details of each
  for (let i = 0; i < allQRImages.length; i++) {
    const img = allQRImages[i];
    const box = await img.boundingBox();
    const src = await img.getAttribute('src');
    const parent = await img.evaluate(el => {
      const p = el.parentElement;
      return {
        className: p.className,
        parentClassName: p.parentElement?.className
      };
    });
    
    console.log(`\nQR Image ${i + 1}:`);
    console.log('  src:', src);
    console.log('  position:', box);
    console.log('  parent:', parent);
    
    // Highlight each one differently
    await img.evaluate((el, index) => {
      el.style.border = `3px solid ${index === 0 ? 'red' : 'blue'}`;
    }, i);
  }
  
  // Find the specific cover panel QR
  const coverQR = await page.$('.panel.cover .qr-section img');
  if (coverQR) {
    const box = await coverQR.boundingBox();
    console.log('\n=== COVER PANEL QR ===');
    console.log('Position:', box);
    await coverQR.evaluate(el => {
      el.style.border = '5px solid green';
    });
  }
  
  await page.screenshot({ path: 'all-qr-codes.png', fullPage: true });
  
  console.log('\nRed = First QR found');
  console.log('Blue = Second QR (if any)');
  console.log('Green = Cover panel QR');
  console.log('\nBrowser open for 30 seconds...');
  
  await page.waitForTimeout(30000);
  await browser.close();
}

findAllQR();