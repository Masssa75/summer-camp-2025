const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function checkQRCode() {
  // First check if the file exists
  const qrPath = path.join(__dirname, 'References/QR Code daycare.png');
  if (fs.existsSync(qrPath)) {
    console.log('✅ QR Code daycare.png file exists at:', qrPath);
  } else {
    console.log('❌ QR Code daycare.png file NOT FOUND at:', qrPath);
    
    // List files in References directory
    const referencesDir = path.join(__dirname, 'References');
    console.log('\nFiles in References directory:');
    const files = fs.readdirSync(referencesDir);
    files.filter(f => f.includes('QR')).forEach(f => console.log(' -', f));
  }

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  
  await page.waitForTimeout(1000);
  
  // Check if QR code image loads
  const qrImage = await page.$('.panel.cover .qr-section img');
  if (qrImage) {
    const src = await qrImage.getAttribute('src');
    console.log('\nQR Code src attribute:', src);
    
    // Check if image loads successfully
    const isVisible = await qrImage.isVisible();
    const box = await qrImage.boundingBox();
    
    console.log('QR Code visible:', isVisible);
    console.log('QR Code dimensions:', box);
    
    // Check natural size to see if image loaded
    const naturalSize = await qrImage.evaluate(img => ({
      width: img.naturalWidth,
      height: img.naturalHeight
    }));
    
    if (naturalSize.width === 0 || naturalSize.height === 0) {
      console.log('❌ QR Code image failed to load!');
    } else {
      console.log('✅ QR Code loaded successfully');
      console.log('Natural size:', naturalSize);
    }
  } else {
    console.log('❌ QR Code element not found');
  }
  
  await page.screenshot({ path: 'qr-daycare-check.png', fullPage: true });
  console.log('\nScreenshot saved as qr-daycare-check.png');
  
  console.log('\nBrowser open for 15 seconds...');
  await page.waitForTimeout(15000);
  
  await browser.close();
}

checkQRCode();