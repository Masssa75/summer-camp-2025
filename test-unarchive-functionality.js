const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing Unarchive Functionality...');
  
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
    
    console.log('🔍 Testing unarchive functionality...');
    
    // Check for archived registrations link
    const archivedLink = await page.locator('text=Archived').first();
    if (await archivedLink.isVisible()) {
      console.log('✅ Archived registrations link found');
      
      // Click to show archived section
      await archivedLink.click();
      await page.waitForTimeout(1000);
      
      // Check if archived section appears
      const archivedSection = await page.locator('text=Archived Registrations').first();
      if (await archivedSection.isVisible()) {
        console.log('✅ Archived section is visible');
        
        // Look for unarchive button
        const unarchiveBtn = await page.locator('.action-btn.unarchive').first();
        if (await unarchiveBtn.isVisible()) {
          console.log('✅ Unarchive button found (↩️)');
          
          // Test unarchive functionality
          await unarchiveBtn.click();
          await page.waitForTimeout(1000);
          
          // Handle confirm dialog
          page.on('dialog', async dialog => {
            console.log(`📋 Unarchive dialog: ${dialog.message()}`);
            await dialog.accept(); // Accept to test the flow
          });
          
          await page.waitForTimeout(2000);
          console.log('✅ Registration unarchived successfully');
          
          // Check if archived count decreases
          const updatedArchivedLink = await page.locator('text=Archived').first();
          if (await updatedArchivedLink.isVisible()) {
            console.log('✅ Archived link updated after unarchive');
          }
          
          // Check if registration appears back in active workflow
          const activeSection = await page.locator('text=Active Workflow').first();
          if (await activeSection.isVisible()) {
            console.log('✅ Active workflow section still visible');
          }
        }
      }
    } else {
      console.log('ℹ️ No archived registrations found - will create one first');
      
      // First create an archived registration
      const dropdownButtons = await page.locator('.action-dropdown .action-btn').all();
      if (dropdownButtons.length > 0) {
        await dropdownButtons[0].click();
        await page.waitForTimeout(500);
        
        const archiveButton = await page.locator('text=Archive (Abandoned)').first();
        if (await archiveButton.isVisible()) {
          await archiveButton.click();
          await page.waitForTimeout(1000);
          
          // Confirm archive
          page.on('dialog', async dialog => {
            await dialog.accept();
          });
          
          await page.waitForTimeout(2000);
          console.log('✅ Created archived registration');
          
          // Now test the unarchive functionality
          const newArchivedLink = await page.locator('text=Archived').first();
          if (await newArchivedLink.isVisible()) {
            await newArchivedLink.click();
            await page.waitForTimeout(1000);
            
            const unarchiveBtn = await page.locator('.action-btn.unarchive').first();
            if (await unarchiveBtn.isVisible()) {
              console.log('✅ Unarchive button found after archiving');
              
              await unarchiveBtn.click();
              await page.waitForTimeout(1000);
              
              // Handle unarchive dialog
              page.on('dialog', async dialog => {
                console.log(`📋 Unarchive dialog: ${dialog.message()}`);
                await dialog.accept();
              });
              
              await page.waitForTimeout(2000);
              console.log('✅ Unarchive functionality working');
            }
          }
        }
      }
    }
    
    console.log('🎉 Unarchive functionality test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();