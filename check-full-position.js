const { chromium } = require('playwright');
const path = require('path');

async function checkFullPosition() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  
  await page.waitForTimeout(1000);
  
  // Get all relevant elements
  const qrSection = await page.$('.panel.cover .qr-section');
  const qrImage = await page.$('.panel.cover .qr-section img');
  const bottomSection = await page.$('.panel.cover .bottom-section');
  const textContent = await page.$('.panel.cover .text-content');
  
  if (qrSection && bottomSection && textContent) {
    const qrSectionBox = await qrSection.boundingBox();
    const qrImageBox = await qrImage.boundingBox();
    const bottomBox = await bottomSection.boundingBox();
    const textBox = await textContent.boundingBox();
    
    console.log('Bottom section:', bottomBox);
    console.log('Text content:', textBox);
    console.log('QR section:', qrSectionBox);
    console.log('QR image:', qrImageBox);
    
    console.log('\nHorizontal analysis:');
    console.log(`Text ends at: ${textBox.x + textBox.width}`);
    console.log(`QR starts at: ${qrSectionBox.x}`);
    console.log(`Space between text and QR: ${qrSectionBox.x - (textBox.x + textBox.width)}px`);
    console.log(`QR distance from right edge: ${(bottomBox.x + bottomBox.width) - (qrSectionBox.x + qrSectionBox.width)}px`);
  }
  
  console.log('\nBrowser open for 20 seconds...');
  await page.waitForTimeout(20000);
  
  await browser.close();
}

checkFullPosition();