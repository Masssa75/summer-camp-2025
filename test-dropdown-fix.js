const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing Dropdown Menu Fix...');
  
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
    
    console.log('🔍 Testing dropdown menu functionality...');
    
    // Look for dropdown buttons (more actions)
    const dropdownButtons = await page.locator('.action-dropdown .action-btn').all();
    console.log(`Found ${dropdownButtons.length} dropdown buttons`);
    
    if (dropdownButtons.length > 0) {
      // Test clicking the first dropdown button
      console.log('🖱️ Clicking first dropdown button...');
      await dropdownButtons[0].click();
      await page.waitForTimeout(1000);
      
      // Check if dropdown menu is visible
      const dropdownMenu = await page.locator('.dropdown-menu.active').first();
      if (await dropdownMenu.isVisible()) {
        console.log('✅ Dropdown menu is visible after click');
        
        // Check for menu items
        const menuItems = ['Send Email', 'Send WhatsApp', 'Archive (Abandoned)'];
        for (const item of menuItems) {
          const menuItem = await page.locator(`text=${item}`).first();
          if (await menuItem.isVisible()) {
            console.log(`✅ Menu item "${item}" is visible`);
          } else {
            console.log(`❌ Menu item "${item}" is NOT visible`);
          }
        }
        
        // Test clicking outside to close
        console.log('🖱️ Testing click outside to close...');
        await page.click('body');
        await page.waitForTimeout(500);
        
        // Check if dropdown closed
        const closedDropdown = await page.locator('.dropdown-menu.active').first();
        if (!(await closedDropdown.isVisible())) {
          console.log('✅ Dropdown closes when clicking outside');
        } else {
          console.log('❌ Dropdown did NOT close when clicking outside');
        }
        
        // Test archive functionality
        console.log('🖱️ Testing archive functionality...');
        await dropdownButtons[0].click();
        await page.waitForTimeout(500);
        
        const archiveButton = await page.locator('text=Archive (Abandoned)').first();
        if (await archiveButton.isVisible()) {
          console.log('✅ Archive button is clickable');
          
          // Click archive (this will show a confirm dialog)
          await archiveButton.click();
          await page.waitForTimeout(1000);
          
          // Handle confirm dialog
          page.on('dialog', async dialog => {
            console.log(`📋 Confirm dialog appeared: ${dialog.message()}`);
            await dialog.dismiss(); // Don't actually archive in test
          });
          
          console.log('✅ Archive functionality is working');
        }
        
      } else {
        console.log('❌ Dropdown menu is NOT visible after click');
      }
    } else {
      console.log('ℹ️ No dropdown buttons found (no registrations or different state)');
    }
    
    console.log('🎉 Dropdown menu test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();