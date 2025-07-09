const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing Registration Details Modal...');
  
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
    
    console.log('🔍 Testing registration details modal...');
    
    // Look for view details buttons
    const viewButtons = await page.locator('.action-btn.view').all();
    console.log(`Found ${viewButtons.length} view buttons`);
    
    if (viewButtons.length > 0) {
      // Click the first view button
      console.log('👁️ Clicking first view details button...');
      await viewButtons[0].click();
      await page.waitForTimeout(1000);
      
      // Check if modal appears
      const modal = await page.locator('.registration-details-modal').first();
      if (await modal.isVisible()) {
        console.log('✅ Registration details modal is visible');
        
        // Check for sections
        const sections = [
          'Child Information',
          'Parent Information', 
          'Camp Information',
          'Health & Safety',
          'Payment Information',
          'Workflow Status'
        ];
        
        for (const section of sections) {
          const sectionElement = await page.locator(`text=${section}`).first();
          if (await sectionElement.isVisible()) {
            console.log(`✅ Section "${section}" is visible`);
          } else {
            console.log(`❌ Section "${section}" is NOT visible`);
          }
        }
        
        // Check for details grid
        const detailsGrid = await page.locator('.details-grid').first();
        if (await detailsGrid.isVisible()) {
          console.log('✅ Details grid is visible');
          
          // Check for some specific fields
          const fields = ['Full Name', 'Email', 'Age Group', 'Payment Status'];
          for (const field of fields) {
            const fieldElement = await page.locator(`text=${field}`).first();
            if (await fieldElement.isVisible()) {
              console.log(`✅ Field "${field}" is visible`);
            }
          }
        }
        
        // Check for status badges
        const statusBadges = await page.locator('.status-badge').all();
        console.log(`✅ Found ${statusBadges.length} status badges in modal`);
        
        // Check for document links (if any)
        const documentLinks = await page.locator('.document-link').all();
        if (documentLinks.length > 0) {
          console.log(`✅ Found ${documentLinks.length} document links`);
        } else {
          console.log('ℹ️ No document links found (no uploaded documents)');
        }
        
        // Test modal close
        console.log('🔐 Testing modal close...');
        const closeBtn = await page.locator('.close-btn').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await page.waitForTimeout(500);
          
          // Check if modal is closed
          if (!(await modal.isVisible())) {
            console.log('✅ Modal closes correctly');
          } else {
            console.log('❌ Modal did NOT close');
          }
        }
        
        // Test clicking outside to close
        console.log('🖱️ Testing click outside to close...');
        await viewButtons[0].click();
        await page.waitForTimeout(500);
        
        // Click outside modal
        await page.click('.modal-overlay');
        await page.waitForTimeout(500);
        
        if (!(await modal.isVisible())) {
          console.log('✅ Modal closes when clicking outside');
        } else {
          console.log('❌ Modal does NOT close when clicking outside');
        }
        
      } else {
        console.log('❌ Registration details modal is NOT visible');
      }
    } else {
      console.log('ℹ️ No view buttons found (no registrations or different state)');
    }
    
    console.log('🎉 Registration details modal test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();