const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing Payment Modal Final Test...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console messages and errors
  page.on('console', message => {
    if (message.type() === 'error') {
      console.log('❌ Console error:', message.text());
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
        
        // Get the registration ID to watch for the API call
        const registrationId = await page.evaluate(() => {
          const workflowTable = document.querySelector('.workflow-table');
          if (workflowTable) {
            const firstRow = workflowTable.querySelector('tbody tr');
            if (firstRow) {
              return firstRow.getAttribute('data-registration-id') || 'unknown';
            }
          }
          return 'unknown';
        });
        
        console.log(`Registration ID: ${registrationId}`);
        
        // Scroll the save button into view
        const saveButton = await page.locator('button[type="submit"]').first();
        await saveButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        
        console.log('✅ Save button is in viewport');
        
        // Test changing payment status to pending
        console.log('🔄 Testing status change to pending...');
        const statusSelect = await page.locator('select').first();
        await statusSelect.selectOption('pending');
        await page.waitForTimeout(1000);
        
        // Monitor network activity
        let apiCallCompleted = false;
        page.on('response', response => {
          if (response.url().includes('/payment') && response.request().method() === 'POST') {
            console.log(`🌐 Payment API response: ${response.status()}`);
            apiCallCompleted = true;
          }
        });
        
        // Test clicking save button
        console.log('💾 Testing save button click...');
        await saveButton.click();
        
        // Wait for API call to complete
        await page.waitForTimeout(3000);
        
        if (apiCallCompleted) {
          console.log('✅ API call completed');
        } else {
          console.log('❌ API call did not complete');
        }
        
        // Check if modal closes
        if (!(await paymentModal.isVisible())) {
          console.log('✅ Modal closed after save');
          
          // Check if the badge updated in the table
          await page.waitForTimeout(1000);
          const updatedBadges = await page.locator('.status-badge.status-payment-pending').all();
          console.log(`Found ${updatedBadges.length} pending payment badges after update`);
          
        } else {
          console.log('❌ Modal did NOT close after save');
        }
      } else {
        console.log('❌ Payment modal did NOT open');
      }
    } else {
      console.log('ℹ️ No paid status badges found');
    }
    
    console.log('🎉 Payment modal final test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();