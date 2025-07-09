const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Starting high-quality poster export...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-web-security'] // To handle local file access
  });
  
  const page = await browser.newPage();
  
  // For 70x100cm at 300 DPI:
  // 70cm = 27.56 inches * 300 DPI = 8268 pixels width
  // 100cm = 39.37 inches * 300 DPI = 11811 pixels height
  // But that's too large for most systems, so let's use 150 DPI for a good balance
  // 70cm = 27.56 inches * 150 DPI = 4134 pixels width  
  // 100cm = 39.37 inches * 150 DPI = 5906 pixels height
  
  await page.setViewportSize({
    width: 4134,
    height: 5906
  });
  
  // Load the HTML file
  const filePath = 'file://' + path.resolve(__dirname, 'mockups/summer-camp-poster-70x100-v2.html');
  await page.goto(filePath, { waitUntil: 'networkidle' });
  
  // Wait a bit for fonts and images to fully load
  await page.waitForTimeout(3000);
  
  // Take screenshot of just the poster element
  const poster = await page.locator('.poster');
  
  // Export at different quality levels
  console.log('Exporting at 150 DPI (good for most print shops)...');
  await poster.screenshot({
    path: 'summer-camp-poster-150dpi.jpg',
    quality: 100,
    type: 'jpeg'
  });
  
  console.log('Exporting as PNG (lossless)...');
  await poster.screenshot({
    path: 'summer-camp-poster-150dpi.png',
    type: 'png'
  });
  
  // Also create a smaller preview version
  await page.setViewportSize({
    width: 2067,
    height: 2953
  });
  
  console.log('Exporting preview version (75 DPI)...');
  await poster.screenshot({
    path: 'summer-camp-poster-preview.jpg',
    quality: 95,
    type: 'jpeg'
  });
  
  await browser.close();
  
  console.log('\nExport complete! Files created:');
  console.log('- summer-camp-poster-150dpi.jpg (High quality for printing)');
  console.log('- summer-camp-poster-150dpi.png (Lossless for printing)');
  console.log('- summer-camp-poster-preview.jpg (For email/preview)');
  console.log('\nRecommended: Send the PNG file to the print shop for best quality.');
})();