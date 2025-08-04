const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Use headed mode to see
  const page = await browser.newPage();
  
  console.log('Debugging reorder buttons visibility...');
  
  try {
    // Login
    await page.goto('https://phuketsummercamp.com/test-auth', { waitUntil: 'networkidle' });
    await page.fill('input[type="password"]', 'test123');
    await page.click('button:has-text("Login")');
    await page.waitForURL('**/admin', { timeout: 10000 });
    
    // Go to teacher recruitment
    await page.goto('https://phuketsummercamp.com/admin/teacher-recruitment', { waitUntil: 'networkidle' });
    
    // Check if reorder buttons exist in DOM
    const reorderButtons = await page.locator('.reorder-btn').count();
    console.log('Reorder buttons in DOM:', reorderButtons);
    
    // Check if reorder-buttons container exists
    const reorderContainers = await page.locator('.reorder-buttons').count();
    console.log('Reorder button containers:', reorderContainers);
    
    // Check if contact-controls exist
    const contactControls = await page.locator('.contact-controls').count();
    console.log('Contact controls:', contactControls);
    
    // Check CSS properties of first reorder button
    if (reorderButtons > 0) {
      const firstButton = page.locator('.reorder-btn').first();
      const isVisible = await firstButton.isVisible();
      const boundingBox = await firstButton.boundingBox();
      
      console.log('First reorder button visible:', isVisible);
      console.log('First reorder button bounds:', boundingBox);
      
      // Get computed styles
      const styles = await firstButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          width: computed.width,
          height: computed.height,
          position: computed.position
        };
      });
      console.log('Button styles:', styles);
    }
    
    // Keep browser open for inspection
    console.log('Browser kept open for inspection. Press Ctrl+C to close.');
    await page.waitForTimeout(300000); // Wait 5 minutes
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
})();