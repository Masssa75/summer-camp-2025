const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing Payment Modal Save Button Visibility...');
  
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
    
    console.log('🔍 Testing payment modal functionality...');
    
    // Look for paid status badges
    const paidBadges = await page.locator('.status-badge.status-paid.editable-badge').all();
    console.log(`Found ${paidBadges.length} paid status badges`);
    
    if (paidBadges.length > 0) {
      console.log('💰 Testing paid badge click...');
      
      // Click the paid badge
      await paidBadges[0].click();
      await page.waitForTimeout(2000);
      
      // Check if payment modal opens
      const paymentModal = await page.locator('.modal-overlay').first();
      if (await paymentModal.isVisible()) {
        console.log('✅ Payment modal opened');
        
        // Check if save button is visible
        const saveButton = await page.locator('button[type="submit"]').first();
        const isVisible = await saveButton.isVisible();
        console.log(`Save button visible: ${isVisible}`);
        
        if (isVisible) {
          // Check if save button is within viewport
          const buttonBox = await saveButton.boundingBox();
          const viewportSize = await page.viewportSize();
          
          if (buttonBox) {
            const isInViewport = buttonBox.y + buttonBox.height <= viewportSize.height;
            console.log(`Save button in viewport: ${isInViewport}`);
            console.log(`Button position: y=${buttonBox.y}, height=${buttonBox.height}`);
            console.log(`Viewport height: ${viewportSize.height}`);
            
            // Test if the modal body is scrollable
            const modalBody = await page.locator('.payment-modal-body').first();
            const modalBodyBox = await modalBody.boundingBox();
            
            if (modalBodyBox) {
              // Check if modal body has scrollable content
              const scrollHeight = await modalBody.evaluate(el => el.scrollHeight);
              const clientHeight = await modalBody.evaluate(el => el.clientHeight);
              const isScrollable = scrollHeight > clientHeight;
              
              console.log(`Modal body scrollable: ${isScrollable}`);
              console.log(`Scroll height: ${scrollHeight}, Client height: ${clientHeight}`);
              
              if (isScrollable) {
                console.log('📜 Testing modal scrolling...');
                await modalBody.evaluate(el => el.scrollTop = 100);
                await page.waitForTimeout(1000);
                
                // Check if save button is still visible after scrolling
                const saveButtonStillVisible = await saveButton.isVisible();
                console.log(`Save button still visible after scrolling: ${saveButtonStillVisible}`);
              }
            }
            
            // Test changing payment status to pending
            console.log('🔄 Testing status change to pending...');
            const statusSelect = await page.locator('select').first();
            await statusSelect.selectOption('pending');
            await page.waitForTimeout(1000);
            
            // Test clicking save button
            console.log('💾 Testing save button click...');
            await saveButton.click();
            await page.waitForTimeout(3000);
            
            // Check if modal closes
            if (!(await paymentModal.isVisible())) {
              console.log('✅ Modal closed after save');
            } else {
              console.log('❌ Modal did NOT close after save');
            }
          }
        } else {
          console.log('❌ Save button is NOT visible');
        }
      } else {
        console.log('❌ Payment modal did NOT open');
      }
    } else {
      console.log('ℹ️ No paid status badges found');
    }
    
    console.log('🎉 Payment modal save button test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();