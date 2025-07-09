const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing Workflow Organization Features...');
  
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
    
    // Check for workflow sections
    const workflowSection = await page.locator('.registration-workflow').first();
    await workflowSection.scrollIntoViewIfNeeded();
    
    console.log('🔍 Testing workflow sections...');
    
    // Test Active Workflow Section
    const activeSection = await page.locator('text=Active Workflow').first();
    if (await activeSection.isVisible()) {
      console.log('✅ Active Workflow section is visible');
      
      // Check for active registrations table
      const activeTable = await page.locator('.workflow-table').first();
      if (await activeTable.isVisible()) {
        console.log('✅ Active workflow table is visible');
        
        // Check for expand button if there are more than 10 entries
        const expandBtn = await page.locator('text=Show All').first();
        if (await expandBtn.isVisible()) {
          console.log('✅ Expand button found - testing pagination');
          await expandBtn.click();
          await page.waitForTimeout(1000);
          
          // Check if "Show Less" button appears
          const showLessBtn = await page.locator('text=Show Less').first();
          if (await showLessBtn.isVisible()) {
            console.log('✅ Show Less button appears after expansion');
          }
        } else {
          console.log('ℹ️ No expand button (less than 10 active registrations)');
        }
      }
    }
    
    // Test Completed Section
    const completedSection = await page.locator('text=Completed Registrations').first();
    if (await completedSection.isVisible()) {
      console.log('✅ Completed Registrations section is visible');
      
      // Check for Show/Hide button
      const showCompletedBtn = await page.locator('text=Show').first();
      if (await showCompletedBtn.isVisible()) {
        console.log('🔍 Testing completed section toggle...');
        await showCompletedBtn.click();
        await page.waitForTimeout(1000);
        
        // Check if completed table appears
        const completedTable = await page.locator('.completed-table').first();
        if (await completedTable.isVisible()) {
          console.log('✅ Completed table appears when expanded');
          
          // Check for archive buttons
          const archiveBtn = await page.locator('.action-btn.archive').first();
          if (await archiveBtn.isVisible()) {
            console.log('✅ Archive button found in completed section');
          }
        }
        
        // Check for Hide button
        const hideBtn = await page.locator('text=Hide').first();
        if (await hideBtn.isVisible()) {
          console.log('✅ Hide button appears when section is expanded');
        }
      }
    }
    
    // Test Archived Section
    const archivedSection = await page.locator('text=Archived').first();
    if (await archivedSection.isVisible()) {
      console.log('✅ Archived section is visible');
    } else {
      console.log('ℹ️ No archived section (no archived registrations yet)');
    }
    
    // Test stats cards
    const statsCards = await page.locator('.stat-card');
    const statsCount = await statsCards.count();
    console.log(`✅ Found ${statsCount} stats cards`);
    
    // Check stats content
    const statLabels = ['New Registrations', 'Awaiting Payment', 'Paid', 'Confirmed'];
    for (const label of statLabels) {
      const statCard = await page.locator(`text=${label}`).first();
      if (await statCard.isVisible()) {
        console.log(`✅ Stat card "${label}" is visible`);
      }
    }
    
    // Check workflow table headers
    const headers = ['Registration Info', 'Payment Request', 'Payment Status', 'Confirmation', 'Progress', 'Actions'];
    for (const header of headers) {
      const headerElement = await page.locator(`text=${header}`).first();
      if (await headerElement.isVisible()) {
        console.log(`✅ Table header "${header}" is visible`);
      }
    }
    
    // Test section headers
    const sectionHeaders = await page.locator('.section-header');
    const sectionCount = await sectionHeaders.count();
    console.log(`✅ Found ${sectionCount} section headers`);
    
    console.log('🎉 Workflow organization test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();