const { chromium } = require('playwright');

(async () => {
  console.log('Checking live CSS...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Check if our CSS fixes are applied
    const cssCheck = await page.evaluate(() => {
      const bgImg = document.querySelector('.slide-2 .background-layer img');
      if (!bgImg) return { error: 'No background image found' };
      
      const computed = window.getComputedStyle(bgImg);
      
      // Check all stylesheets for our specific rules
      let hasObjectPositionFix = false;
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.cssText && rule.cssText.includes('object-position') && rule.cssText.includes('center top')) {
              hasObjectPositionFix = true;
              break;
            }
          }
        } catch (e) {}
      }
      
      return {
        computedObjectPosition: computed.objectPosition,
        hasObjectPositionFix,
        bodyPaddingTop: window.getComputedStyle(document.body).paddingTop
      };
    });
    
    console.log('CSS Check Results:', cssCheck);
    
    // Try to clear cache and reload
    await page.reload({ waitUntil: 'networkidle' });
    
    // Check build ID
    const buildInfo = await page.evaluate(() => {
      const buildId = document.querySelector('meta[name="next-build-id"]')?.getAttribute('content');
      return {
        buildId,
        timestamp: new Date().toISOString()
      };
    });
    
    console.log('Build info:', buildInfo);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();