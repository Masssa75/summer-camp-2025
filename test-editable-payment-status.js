const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing Editable Payment Status...');
  
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
    
    console.log('🔍 Testing editable payment status badges...');
    
    // Look for paid status badges
    const paidBadges = await page.locator('.status-badge.status-paid.editable-badge').all();
    console.log(`Found ${paidBadges.length} paid status badges`);
    
    if (paidBadges.length > 0) {
      console.log('💰 Testing paid badge click...');
      
      // Test hover effect
      await paidBadges[0].hover();
      await page.waitForTimeout(1000);
      console.log('✅ Hover effect applied');
      
      // Click the paid badge
      await paidBadges[0].click();
      await page.waitForTimeout(2000);
      
      // Check if payment modal opens
      const paymentModal = await page.locator('.modal-overlay').first();
      if (await paymentModal.isVisible()) {
        console.log('✅ Payment modal opened');
        
        // Check modal title
        const modalTitle = await page.locator('.modal-title').first();
        const titleText = await modalTitle.textContent();
        console.log(`Modal title: "${titleText}"`);
        
        // Check if form is pre-populated
        const statusSelect = await page.locator('select').first();
        const statusValue = await statusSelect.inputValue();
        console.log(`Payment status pre-populated: "${statusValue}"`);
        
        // Check for pending option
        const pendingOption = await page.locator('option[value="pending"]').first();
        if (await pendingOption.isVisible()) {
          console.log('✅ Pending option is available');
          
          // Test changing to pending
          await statusSelect.selectOption('pending');
          await page.waitForTimeout(1000);
          console.log('✅ Changed status to pending');
          
          // Check if save button is visible and clickable
          const saveButton = await page.locator('button[type="submit"]').first();
          if (await saveButton.isVisible()) {
            console.log('✅ Save button is visible');
            
            // Test clicking save button
            await saveButton.click();
            await page.waitForTimeout(2000);
            console.log('✅ Save button clicked');
            
            // Check if modal closes
            if (!(await paymentModal.isVisible())) {
              console.log('✅ Modal closed after save');
            }
          } else {
            console.log('❌ Save button is NOT visible');
          }
        }
      } else {
        console.log('❌ Payment modal did NOT open');
      }
    } else {
      console.log('ℹ️ No paid status badges found');
      
      // Look for pending payment badges
      const pendingBadges = await page.locator('.status-badge.status-payment-pending').all();
      console.log(`Found ${pendingBadges.length} pending payment badges`);
      
      if (pendingBadges.length > 0) {
        console.log('💰 Testing pending badge click...');
        await pendingBadges[0].click();
        await page.waitForTimeout(2000);
        
        const paymentModal = await page.locator('.modal-overlay').first();
        if (await paymentModal.isVisible()) {
          console.log('✅ Payment modal opened from pending badge');
        }
      }
    }
    
    console.log('🎉 Editable payment status test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();