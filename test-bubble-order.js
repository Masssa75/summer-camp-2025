const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Testing bubble sort order (income above expenses)...\n');

  // Navigate to planner page
  console.log('1. Navigating to planner page...');
  await page.goto('https://phuketsummercamp.com/planner', { waitUntil: 'networkidle' });

  // Enter password
  console.log('2. Entering password...');
  await page.fill('#loginPassword', 'donkey');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(2000);

  console.log('\n✓ Visual verification required:');
  console.log('  Please check that on dates with BOTH income and expense:');
  console.log('  - GREEN income bubbles appear ABOVE');
  console.log('  - RED expense bubbles appear BELOW');
  console.log('  - Within each type, larger amounts appear first');
  console.log('\n  Look specifically at dates like Oct 31, Nov 14, Nov 30, Dec 14, Dec 31');

  // Take a screenshot
  await page.screenshot({ path: 'bubble-order-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved as bubble-order-test.png');

  console.log('\nBrowser will stay open for 15 seconds for visual inspection...');
  await page.waitForTimeout(15000);
  await browser.close();
})();
