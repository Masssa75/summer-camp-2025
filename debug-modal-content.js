const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Debugging Modal Content...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to test auth page
    console.log('📱 Navigating to test auth page...');
    await page.goto('https://phuketsummercamp.com/test-auth', { waitUntil: 'networkidle' });
    
    // Enter test password
    await page.fill('input[type="password"]', 'test123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to admin page
    await page.waitForURL('**/admin', { timeout: 15000 });
    await page.waitForSelector('text=Summer Camp Admin', { timeout: 10000 });
    console.log('✅ Logged in to admin dashboard');
    
    // Scroll to workflow section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Find workflow section
    const workflowSection = await page.locator('.registration-workflow').first();
    await workflowSection.scrollIntoViewIfNeeded();
    
    console.log('🔍 Checking what modal appears...');
    
    // Look for view details buttons
    const viewButtons = await page.locator('.action-btn.view').all();
    console.log(`Found ${viewButtons.length} view buttons`);
    
    if (viewButtons.length > 0) {
      // Click the first view button
      console.log('👁️ Clicking first view details button...');
      await viewButtons[0].click();
      await page.waitForTimeout(1000);
      
      // Check what modal content appears
      const modalContent = await page.evaluate(() => {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
          const content = overlay.querySelector('.modal-content');
          if (content) {
            return {
              hasTitle: !!content.querySelector('.modal-title'),
              title: content.querySelector('.modal-title')?.textContent || '',
              hasDetailsModal: !!content.querySelector('.registration-details-modal'),
              className: content.className,
              innerHTML: content.innerHTML.substring(0, 500) + '...'
            };
          }
        }
        return null;
      });
      
      console.log('Modal content:', modalContent);
      
      // If there's a modal, try to close it
      if (modalContent) {
        console.log('📤 Closing current modal...');
        const closeBtn = await page.locator('.close-btn').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await page.waitForTimeout(1000);
          console.log('✅ Modal closed');
        } else {
          // Click outside to close
          await page.click('.modal-overlay');
          await page.waitForTimeout(1000);
          console.log('✅ Modal closed by clicking outside');
        }
        
        // Try clicking view button again
        console.log('🔄 Trying view button again...');
        await viewButtons[0].click();
        await page.waitForTimeout(1000);
        
        // Check content again
        const modalContent2 = await page.evaluate(() => {
          const overlay = document.querySelector('.modal-overlay');
          if (overlay) {
            const content = overlay.querySelector('.modal-content');
            if (content) {
              return {
                hasTitle: !!content.querySelector('.modal-title'),
                title: content.querySelector('.modal-title')?.textContent || '',
                hasDetailsModal: !!content.querySelector('.registration-details-modal'),
                hasDetailsSection: !!content.querySelector('.details-section'),
                className: content.className,
                innerHTML: content.innerHTML.substring(0, 500) + '...'
              };
            }
          }
          return null;
        });
        
        console.log('Second modal content:', modalContent2);
      }
    }
    
    console.log('🎉 Debug completed!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
})();