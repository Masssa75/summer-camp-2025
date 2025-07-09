const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing schedule section fix on mobile...');
  
  const browser = await chromium.launch({ 
    headless: false
  });
  
  // Test on iPhone 14 Pro
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro']
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to localhost to test the fix
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    console.log('Page loaded successfully');
    
    // Click on Schedule in navigation
    console.log('Clicking on Schedule link...');
    await page.click('text=Schedule');
    
    // Wait for navigation
    await page.waitForTimeout(2000);
    
    // Check if the fade gradient is gone
    const scheduleContainer = await page.$('.schedule-container');
    if (scheduleContainer) {
      const afterContent = await scheduleContainer.evaluate(el => {
        const after = window.getComputedStyle(el, '::after');
        return {
          display: after.display,
          content: after.content,
          background: after.background
        };
      });
      console.log('::after pseudo-element styles:', afterContent);
      
      if (afterContent.display === 'none') {
        console.log('✅ Success: Fade gradient is disabled on mobile');
      } else {
        console.log('❌ Issue: Fade gradient is still visible');
      }
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'schedule-mobile-fixed.png',
      fullPage: false 
    });
    console.log('Screenshot saved as schedule-mobile-fixed.png');
    
    // Check if scroll hint is visible
    const beforeContent = await scheduleContainer.evaluate(el => {
      const before = window.getComputedStyle(el, '::before');
      return {
        content: before.content,
        display: before.display,
        position: before.position
      };
    });
    console.log('Scroll hint (::before) styles:', beforeContent);
    
    console.log('\\nTest completed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
  
  console.log('\\nBrowser will close in 10 seconds...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();