const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Exporting print-quality poster...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-web-security']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to match poster size
  await page.setViewportSize({
    width: 4200,
    height: 6000
  });
  
  // Load the print version HTML
  const filePath = 'file://' + path.resolve(__dirname, 'mockups/summer-camp-poster-70x100-print.html');
  await page.goto(filePath, { waitUntil: 'networkidle' });
  
  // Wait for images to load
  await page.waitForTimeout(5000);
  
  // Take screenshots
  console.log('Exporting as JPG...');
  await page.screenshot({
    path: 'summer-camp-poster-PRINT.jpg',
    quality: 100,
    type: 'jpeg',
    fullPage: true
  });
  
  console.log('Exporting as PNG (best quality)...');  
  await page.screenshot({
    path: 'summer-camp-poster-PRINT.png',
    type: 'png',
    fullPage: true
  });
  
  await browser.close();
  
  console.log('\n✅ Export complete!');
  console.log('\nFiles created:');
  console.log('📄 summer-camp-poster-PRINT.jpg (4200x6000 pixels)');
  console.log('📄 summer-camp-poster-PRINT.png (4200x6000 pixels)');
  console.log('\n💡 Recommendation: Send the PNG file to your print shop');
  console.log('   It\'s lossless and will give the best print quality.');
  console.log('\n📐 These files are sized for 70x100cm printing at ~150 DPI');
})();