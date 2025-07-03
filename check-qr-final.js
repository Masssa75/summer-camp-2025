const { chromium } = require('playwright');
const path = require('path');

async function checkQRFinal() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  
  await page.waitForTimeout(1000);
  
  // Get all elements
  const qrSection = await page.$('.panel.cover .qr-section');
  const pickupText = await page.$('.panel.cover .pickup-text');
  const qrImage = await page.$('.panel.cover .qr-section img');
  
  console.log('=== ELEMENT CHECK ===');
  console.log('QR Section exists:', !!qrSection);
  console.log('Pickup text exists:', !!pickupText);
  console.log('QR image exists:', !!qrImage);
  
  if (qrSection && pickupText && qrImage) {
    const sectionBox = await qrSection.boundingBox();
    const textBox = await pickupText.boundingBox();
    const imageBox = await qrImage.boundingBox();
    
    console.log('\n=== POSITIONS ===');
    console.log('QR Section:', sectionBox);
    console.log('Pickup text:', textBox);
    console.log('QR image:', imageBox);
    
    // Check vertical alignment
    console.log('\n=== VERTICAL ALIGNMENT ===');
    console.log('Text top:', textBox.y);
    console.log('Text bottom:', textBox.y + textBox.height);
    console.log('Image top:', imageBox.y);
    console.log('Image bottom:', imageBox.y + imageBox.height);
    
    if (textBox.y + textBox.height <= imageBox.y) {
      console.log('✅ Text is fully above image');
    } else {
      console.log('❌ Text and image are overlapping or text is below');
    }
  }
  
  // Take screenshots
  await page.screenshot({ path: 'qr-final-full.png', fullPage: true });
  
  // Close-up of front cover
  const coverPanel = await page.$('.panel.cover');
  if (coverPanel) {
    const box = await coverPanel.boundingBox();
    await page.screenshot({ 
      path: 'qr-final-cover.png', 
      clip: box 
    });
  }
  
  console.log('\nScreenshots saved. Browser open for 20 seconds...');
  await page.waitForTimeout(20000);
  
  await browser.close();
}

checkQRFinal();