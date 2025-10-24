const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('\n🔍 TESTING openModalForEdit FUNCTION DIRECTLY\n');

  await page.goto('https://phuketsummercamp.com/planner.html');
  await page.fill('#loginPassword', 'donkey');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(3000);

  console.log('Step 1: Calling openModalForEdit directly with first event...');
  const result = await page.evaluate(() => {
    if (typeof data === 'undefined' || !data.events || data.events.length === 0) {
      return { error: 'No events found' };
    }

    const firstEvent = data.events[0];
    console.log('First event:', firstEvent);

    if (typeof openModalForEdit !== 'function') {
      return { error: 'openModalForEdit function not found' };
    }

    openModalForEdit(firstEvent);

    // Check if modal is now visible
    const modal = document.getElementById('eventModal');
    return {
      success: true,
      eventUsed: firstEvent,
      modalHasActiveClass: modal?.classList.contains('active'),
      modalDisplay: modal ? window.getComputedStyle(modal).display : 'not found',
      modalTitle: document.getElementById('modalTitle')?.textContent
    };
  });

  console.log('\nResult:', JSON.stringify(result, null, 2));

  console.log('\nStep 2: Taking screenshot...');
  await page.screenshot({ path: '/tmp/planner-edit-direct.png', fullPage: true });
  console.log('Screenshot: /tmp/planner-edit-direct.png');

  if (result.modalHasActiveClass && result.modalDisplay === 'flex') {
    console.log('\n✅ SUCCESS: openModalForEdit function works!');
  } else {
    console.log('\n❌ FAILED: Modal not showing after openModalForEdit call');
  }

  console.log('\n⏸️  Keeping browser open for 20 seconds...');
  await page.waitForTimeout(20000);

  await browser.close();
})();
