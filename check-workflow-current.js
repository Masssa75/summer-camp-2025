const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Checking current workflow state...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to test auth page directly
    console.log('📱 Navigating to test auth page...');
    await page.goto('https://phuketsummercamp.com/test-auth', { waitUntil: 'networkidle' });
    
    // Enter test password
    await page.fill('input[type="password"]', 'test123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to admin page
    await page.waitForURL('**/admin', { timeout: 15000 });
    await page.waitForSelector('text=Summer Camp Admin', { timeout: 10000 });
    console.log('✅ Logged in to admin dashboard');
    
    // Scroll down to find the Registration Workflow section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Take a screenshot of the workflow section
    const workflowSection = await page.locator('.registration-workflow').first();
    if (await workflowSection.isVisible()) {
      await workflowSection.scrollIntoViewIfNeeded();
      await page.screenshot({ 
        path: 'workflow-current-state.png',
        fullPage: false,
        clip: await workflowSection.boundingBox()
      });
      console.log('📸 Screenshot saved as workflow-current-state.png');
      
      // Check workflow legend specifically
      const workflowLegend = await page.locator('.workflow-legend').first();
      if (await workflowLegend.isVisible()) {
        await workflowLegend.screenshot({ path: 'workflow-legend.png' });
        console.log('📸 Workflow legend screenshot saved');
        
        // Check the specific text in the legend
        const legendText = await workflowLegend.textContent();
        console.log('📋 Workflow legend text:', legendText);
        
        // Check for the specific "Record Payment" step
        const recordPaymentStep = await page.locator('text=Record Payment').first();
        if (await recordPaymentStep.isVisible()) {
          console.log('✅ "Record Payment" step is visible in legend');
        } else {
          console.log('❌ "Record Payment" step not found in legend');
        }
      }
      
      // Check current registrations and their statuses
      const rows = await page.locator('.workflow-table tbody tr');
      const rowCount = await rows.count();
      console.log(`📊 Found ${rowCount} registration rows`);
      
      if (rowCount > 0) {
        // Check first few rows for their current status
        for (let i = 0; i < Math.min(3, rowCount); i++) {
          const row = rows.nth(i);
          const childName = await row.locator('.child-name').textContent();
          const statusBadge = await row.locator('.status-badge').first();
          const statusText = await statusBadge.textContent();
          console.log(`👶 ${childName}: ${statusText}`);
        }
      }
    } else {
      console.log('❌ Registration workflow section not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();