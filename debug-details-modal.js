const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Debugging Registration Details Modal...');
  
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
    
    console.log('🔍 Debugging modal...');
    
    // Look for view details buttons
    const viewButtons = await page.locator('.action-btn.view').all();
    console.log(`Found ${viewButtons.length} view buttons`);
    
    if (viewButtons.length > 0) {
      // Click the first view button
      console.log('👁️ Clicking first view details button...');
      await viewButtons[0].click();
      await page.waitForTimeout(1000);
      
      // Check for any modal
      const anyModal = await page.locator('.modal-overlay').all();
      console.log(`Found ${anyModal.length} modal overlays`);
      
      // Check for the specific modal content
      const modalContent = await page.locator('.modal-content').all();
      console.log(`Found ${modalContent.length} modal contents`);
      
      // Check for registration details modal specifically
      const detailsModal = await page.locator('.registration-details-modal').all();
      console.log(`Found ${detailsModal.length} registration details modals`);
      
      // Check if showDetailsModal state is set
      console.log('🔍 Checking modal state...');
      const modalState = await page.evaluate(() => {
        const modals = document.querySelectorAll('.modal-overlay');
        return Array.from(modals).map(modal => ({
          visible: modal.style.display !== 'none',
          classes: modal.className,
          hasContent: modal.querySelector('.modal-content') ? true : false
        }));
      });
      console.log('Modal state:', modalState);
      
      // Check for any JavaScript errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.log('❌ JavaScript error:', msg.text());
        }
      });
      
      // Try clicking again and wait longer
      console.log('🔄 Trying again with longer wait...');
      await viewButtons[0].click();
      await page.waitForTimeout(3000);
      
      // Final check
      const finalModal = await page.locator('.modal-overlay').first();
      if (await finalModal.isVisible()) {
        console.log('✅ Modal is now visible');
        
        // Check content
        const modalTitle = await page.locator('.modal-title').first();
        if (await modalTitle.isVisible()) {
          const titleText = await modalTitle.textContent();
          console.log(`Modal title: "${titleText}"`);
        }
      } else {
        console.log('❌ Modal is still not visible');
      }
    }
    
    console.log('🎉 Debug completed!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
})();