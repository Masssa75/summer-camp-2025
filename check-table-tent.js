const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('file:///Users/marcschwyn/Desktop/projects/summer/mockups/table-tent-stand.html');
  
  // Wait for images to load
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'table-tent-check.png', fullPage: true });
  
  console.log('Screenshot saved as table-tent-check.png');
  console.log('Check if all images are loading properly');
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(30000);
  
  await browser.close();
})();