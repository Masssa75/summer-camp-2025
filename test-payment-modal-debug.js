const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing Payment Modal Debug...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console messages and errors
  page.on('console', message => {
    if (message.type() === 'error') {
      console.log('❌ Console error:', message.text());
    } else if (message.type() === 'warning') {
      console.log('⚠️ Console warning:', message.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('❌ Page error:', error.message);
  });
  
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
        
        // Scroll the save button into view
        const saveButton = await page.locator('button[type="submit"]').first();
        await saveButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        
        // Check if save button is now visible
        const buttonBox = await saveButton.boundingBox();
        const viewportSize = await page.viewportSize();
        
        if (buttonBox) {
          const isInViewport = buttonBox.y + buttonBox.height <= viewportSize.height;
          console.log(`Save button in viewport after scroll: ${isInViewport}`);
          console.log(`Button position: y=${buttonBox.y}, height=${buttonBox.height}`);
          console.log(`Viewport height: ${viewportSize.height}`);
        }
        
        // Test changing payment status to pending
        console.log('🔄 Testing status change to pending...');
        const statusSelect = await page.locator('select').first();
        await statusSelect.selectOption('pending');
        await page.waitForTimeout(1000);
        
        // Test clicking save button
        console.log('💾 Testing save button click...');
        
        // Listen for network requests
        page.on('response', response => {
          if (response.url().includes('/payment') && response.request().method() === 'POST') {
            console.log(`🌐 Payment API response: ${response.status()}`);
          }
        });
        
        await saveButton.click();
        await page.waitForTimeout(5000);
        
        // Check if modal closes
        if (!(await paymentModal.isVisible())) {
          console.log('✅ Modal closed after save');
        } else {
          console.log('❌ Modal did NOT close after save');
          
          // Check if there are any error messages
          const errorMessages = await page.locator('.error, .alert, [role="alert"]').all();
          if (errorMessages.length > 0) {
            console.log('Error messages found:');
            for (const error of errorMessages) {
              const text = await error.textContent();
              console.log(` - ${text}`);
            }
          }
        }
      } else {
        console.log('❌ Payment modal did NOT open');
      }
    } else {
      console.log('ℹ️ No paid status badges found');
    }
    
    console.log('🎉 Payment modal debug test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();