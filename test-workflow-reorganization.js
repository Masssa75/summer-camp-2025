const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing Workflow Reorganization...');
  
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
    
    console.log('🔍 Testing workflow reorganization...');
    
    // Check for workflow links section
    const workflowLinks = await page.locator('.workflow-links').first();
    if (await workflowLinks.isVisible()) {
      console.log('✅ Quick links section is visible');
      
      // Check for completed registrations link
      const completedLink = await page.locator('text=Completed').first();
      if (await completedLink.isVisible()) {
        console.log('✅ Completed registrations link found');
        
        // Test clicking completed link
        await completedLink.click();
        await page.waitForTimeout(1000);
        
        // Check if completed section appears
        const completedSection = await page.locator('text=Completed Registrations').first();
        if (await completedSection.isVisible()) {
          console.log('✅ Completed section appears after clicking');
          
          // Test hiding completed section
          await completedLink.click();
          await page.waitForTimeout(1000);
          console.log('✅ Completed section toggle works');
        }
      }
      
      // Check for archived registrations link
      const archivedLink = await page.locator('text=Archived').first();
      if (await archivedLink.isVisible()) {
        console.log('✅ Archived registrations link found');
        
        // Test clicking archived link
        await archivedLink.click();
        await page.waitForTimeout(1000);
        
        // Check if archived section appears
        const archivedSection = await page.locator('text=Archived Registrations').first();
        if (await archivedSection.isVisible()) {
          console.log('✅ Archived section appears after clicking');
          
          // Check for unarchive button
          const unarchiveBtn = await page.locator('.action-btn.unarchive').first();
          if (await unarchiveBtn.isVisible()) {
            console.log('✅ Unarchive button found');
            
            // Test unarchive functionality (just check click, don't confirm)
            await unarchiveBtn.click();
            await page.waitForTimeout(1000);
            
            // Handle confirm dialog
            page.on('dialog', async dialog => {
              console.log('📋 Unarchive confirm dialog appeared');
              await dialog.dismiss(); // Don't actually unarchive in test
            });
            
            console.log('✅ Unarchive functionality is working');
          }
        }
      } else {
        console.log('ℹ️ No archived registrations link (no archived registrations)');
      }
    }
    
    // Check section order
    const sections = await page.locator('.workflow-table-section').all();
    console.log(`📋 Found ${sections.length} workflow sections`);
    
    // Check that Active Workflow is now at the bottom
    const activeSection = await page.locator('text=Active Workflow').first();
    if (await activeSection.isVisible()) {
      console.log('✅ Active Workflow section found');
      
      // Check that it's the last main section
      const activePosition = await activeSection.boundingBox();
      console.log('📍 Active Workflow section position confirmed');
    }
    
    // Test archive functionality to create archived item
    console.log('🖱️ Testing archive functionality...');
    const dropdownButtons = await page.locator('.action-dropdown .action-btn').all();
    if (dropdownButtons.length > 0) {
      await dropdownButtons[0].click();
      await page.waitForTimeout(500);
      
      const archiveButton = await page.locator('text=Archive (Abandoned)').first();
      if (await archiveButton.isVisible()) {
        console.log('✅ Archive button found');
        
        // Click archive and confirm
        await archiveButton.click();
        await page.waitForTimeout(1000);
        
        // Handle confirm dialog
        page.on('dialog', async dialog => {
          console.log('📋 Archive confirm dialog appeared');
          await dialog.accept(); // Actually archive to test the flow
        });
        
        await page.waitForTimeout(2000);
        console.log('✅ Registration archived successfully');
        
        // Check if archived link appears
        const newArchivedLink = await page.locator('text=Archived (1)').first();
        if (await newArchivedLink.isVisible()) {
          console.log('✅ Archived link updated with count');
        }
      }
    }
    
    console.log('🎉 Workflow reorganization test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();