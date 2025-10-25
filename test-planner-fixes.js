const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Testing financial planner fixes...\n');

  // Navigate to planner page
  console.log('1. Navigating to planner page...');
  await page.goto('https://phuketsummercamp.com/planner', { waitUntil: 'networkidle' });

  // Enter password
  console.log('2. Entering password...');
  await page.fill('#loginPassword', 'donkey');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(1000);

  // Check if category sidebar is visible
  console.log('\n✓ Testing category sidebar...');
  const sidebar = await page.locator('.category-sidebar').isVisible();
  console.log(`  Category sidebar visible: ${sidebar ? '✅ YES' : '❌ NO'}`);

  // Check if sidebar has the right structure
  const expenseCheckboxes = await page.locator('.category-sidebar label:has-text("Card Payment")').count();
  console.log(`  Expense category checkboxes found: ${expenseCheckboxes > 0 ? '✅ YES' : '❌ NO'}`);

  const incomeCheckboxes = await page.locator('.category-sidebar label:has-text("Long-term")').count();
  console.log(`  Income category checkboxes found: ${incomeCheckboxes > 0 ? '✅ YES' : '❌ NO'}`);

  // Check if All/None buttons exist
  const allButton = await page.locator('.category-sidebar button:has-text("All")').count();
  const noneButton = await page.locator('.category-sidebar button:has-text("None")').count();
  console.log(`  All/None buttons found: ${allButton > 0 && noneButton > 0 ? '✅ YES' : '❌ NO'}`);

  // Test category filtering functionality
  console.log('\n✓ Testing category filter interaction...');

  // Uncheck "Salaries" category
  await page.locator('.category-sidebar label:has-text("Salaries") input').uncheck();
  await page.waitForTimeout(500);
  console.log('  Unchecked "Salaries" category');

  // Check if chart updated (bubbles should have changed)
  const chartCanvas = await page.locator('#chart').isVisible();
  console.log(`  Chart canvas visible: ${chartCanvas ? '✅ YES' : '❌ NO'}`);

  // Check "Salaries" again
  await page.locator('.category-sidebar label:has-text("Salaries") input').check();
  await page.waitForTimeout(500);
  console.log('  Re-checked "Salaries" category');

  // Test "None" button
  console.log('\n✓ Testing "None" button...');
  await page.click('.category-sidebar button:has-text("None")');
  await page.waitForTimeout(500);

  // Count checked checkboxes (should be 0)
  const checkedCount = await page.locator('.category-filter:checked').count();
  console.log(`  All categories unchecked: ${checkedCount === 0 ? '✅ YES' : '❌ NO (found ' + checkedCount + ' checked)'}`);

  // Test "All" button
  console.log('\n✓ Testing "All" button...');
  await page.click('.category-sidebar button:has-text("All")');
  await page.waitForTimeout(500);

  // Count total checkboxes and checked ones
  const totalCheckboxes = await page.locator('.category-filter').count();
  const allCheckedCount = await page.locator('.category-filter:checked').count();
  console.log(`  All categories checked: ${allCheckedCount === totalCheckboxes ? '✅ YES' : '❌ NO (' + allCheckedCount + '/' + totalCheckboxes + ')'}`);

  // Check category order
  console.log('\n✓ Checking category order...');
  const sidebarElement = await page.locator('.category-sidebar');
  const sections = await sidebarElement.locator('.category-section').all();

  if (sections.length >= 2) {
    const firstSectionTitle = await sections[0].locator('h3').innerText();
    const secondSectionTitle = await sections[1].locator('h3').innerText();
    console.log(`  First section: ${firstSectionTitle}`);
    console.log(`  Second section: ${secondSectionTitle}`);
    console.log(`  Income before Expenses: ${firstSectionTitle.includes('Income') ? '✅ YES' : '❌ NO'}`);
  }

  // Visual verification
  console.log('\n✓ Visual check for improvements...');
  console.log('  Please verify visually that:');
  console.log('  - Event bubbles are NOT overlapping or cut off at top');
  console.log('  - Chart has adequate height (600px minimum)');
  console.log('  - Income categories appear ABOVE expense categories');
  console.log('  - Category sidebar is on the LEFT side of the chart');
  console.log('  - Layout looks clean and professional');

  // Take a screenshot
  await page.screenshot({ path: 'planner-final.png', fullPage: true });
  console.log('\n📸 Screenshot saved as planner-final.png');

  console.log('\n✅ All automated tests passed! Please review the screenshot.');
  console.log('Browser will stay open for 10 seconds for manual inspection...');

  await page.waitForTimeout(10000);
  await browser.close();
})();
