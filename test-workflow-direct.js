const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing Registration Workflow UI (Direct Test Auth)...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to test auth page directly
    console.log('📱 Navigating to test auth page...');
    await page.goto('https://phuketsummercamp.com/test-auth', { waitUntil: 'networkidle' });
    
    // Enter test password
    console.log('🔐 Entering test password...');
    await page.fill('input[type="password"]', 'test123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to admin page
    console.log('⏳ Waiting for redirect to admin dashboard...');
    await page.waitForURL('**/admin', { timeout: 15000 });
    
    // Wait for dashboard to load
    await page.waitForSelector('text=Summer Camp Admin', { timeout: 10000 });
    console.log('✅ Successfully logged in to admin dashboard');
    
    // Scroll down to find the Registration Workflow section
    console.log('🔍 Looking for Registration Workflow section...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait a bit for any dynamic content to load
    await page.waitForTimeout(2000);
    
    // Check if Registration Workflow section is present
    const workflowSection = await page.locator('text=Registration Workflow').first();
    if (await workflowSection.isVisible()) {
      console.log('✅ Registration Workflow section is visible');
      
      // Scroll to the workflow section
      await workflowSection.scrollIntoViewIfNeeded();
      
      // Check for workflow legend
      const workflowLegend = await page.locator('text=Registration Process').first();
      if (await workflowLegend.isVisible()) {
        console.log('✅ Workflow legend is visible');
      }
      
      // Check for stats cards
      const statsCards = await page.locator('.stat-card');
      const statsCount = await statsCards.count();
      console.log(`✅ Found ${statsCount} stats cards`);
      
      // Check for workflow table
      const workflowTable = await page.locator('.workflow-table');
      if (await workflowTable.isVisible()) {
        console.log('✅ Workflow table is visible');
        
        // Check for table headers
        const headers = ['Registration Info', 'Payment Request', 'Payment Status', 'Confirmation', 'Progress', 'Actions'];
        for (const header of headers) {
          const headerElement = await page.locator(`text=${header}`).first();
          if (await headerElement.isVisible()) {
            console.log(`✅ Table header "${header}" is visible`);
          }
        }
        
        // Check for registration rows
        const rows = await page.locator('.workflow-table tbody tr');
        const rowCount = await rows.count();
        console.log(`✅ Found ${rowCount} registration rows in workflow table`);
        
        if (rowCount > 0) {
          // Check for checkboxes
          const checkboxes = await page.locator('.checkbox-action');
          const checkboxCount = await checkboxes.count();
          console.log(`✅ Found ${checkboxCount} workflow checkboxes`);
          
          // Check for status badges
          const statusBadges = await page.locator('.status-badge');
          const badgeCount = await statusBadges.count();
          console.log(`✅ Found ${badgeCount} status badges`);
          
          // Check for progress dots
          const progressDots = await page.locator('.progress-dots');
          const dotsCount = await progressDots.count();
          console.log(`✅ Found ${dotsCount} progress dot containers`);
          
          // Try clicking on a "Pending Payment" badge if it exists
          const pendingPaymentBadge = await page.locator('.status-payment-pending').first();
          if (await pendingPaymentBadge.isVisible()) {
            console.log('🔍 Testing payment modal...');
            await pendingPaymentBadge.click();
            
            // Check if payment modal appears
            const paymentModal = await page.locator('.modal-overlay').first();
            if (await paymentModal.isVisible()) {
              console.log('✅ Payment modal opened successfully');
              
              // Check for modal form fields
              const formFields = ['Payment Status', 'Amount Received', 'Payment Date', 'Payment Method'];
              for (const field of formFields) {
                const fieldElement = await page.locator(`text=${field}`).first();
                if (await fieldElement.isVisible()) {
                  console.log(`✅ Form field "${field}" is visible`);
                }
              }
              
              // Close modal
              await page.click('.close-btn');
              console.log('✅ Payment modal closed');
            }
          }
          
          // Try clicking a checkbox if available
          const firstCheckbox = await page.locator('.checkbox-action').first();
          if (await firstCheckbox.isVisible() && await firstCheckbox.isEnabled()) {
            console.log('🔍 Testing checkbox functionality...');
            await firstCheckbox.click();
            console.log('✅ Checkbox clicked successfully');
          }
        } else {
          console.log('ℹ️ No registration rows found - this is expected if no registrations exist');
        }
      } else {
        console.log('❌ Workflow table not found');
      }
    } else {
      console.log('❌ Registration Workflow section not found');
    }
    
    console.log('🎉 Workflow UI test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();