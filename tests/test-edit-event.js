const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('\n🔍 TESTING DOUBLE-CLICK EDIT FUNCTIONALITY\n');

  // Capture console logs
  page.on('console', msg => console.log(`[CONSOLE] ${msg.text()}`));

  console.log('Step 1: Loading planner and logging in...');
  await page.goto('https://phuketsummercamp.com/planner.html');
  await page.fill('#loginPassword', 'donkey');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(3000);

  console.log('\nStep 2: Checking that events loaded...');
  const eventCount = await page.locator('.event-item').count();
  console.log(`  Found ${eventCount} events`);

  if (eventCount === 0) {
    console.log('❌ No events found - cannot test editing');
    await browser.close();
    return;
  }

  console.log('\nStep 3: Finding an event to edit...');
  // Get the first event item
  const firstEvent = page.locator('.event-item').first();
  const eventText = await firstEvent.textContent();
  console.log(`  First event: ${eventText.trim().substring(0, 50)}...`);

  console.log('\nStep 4: Double-clicking the event...');
  await firstEvent.dblclick();
  await page.waitForTimeout(1000);

  console.log('\nStep 5: Checking if edit modal/form appeared...');
  const modalVisible = await page.evaluate(() => {
    // Check for various possible edit UI elements
    const modal = document.querySelector('.modal');
    const editForm = document.querySelector('#editEventForm');
    const anyModal = document.querySelector('[class*="modal"]');

    return {
      hasModal: !!modal,
      modalVisible: modal ? !modal.classList.contains('hidden') : false,
      hasEditForm: !!editForm,
      anyModalFound: !!anyModal,
      allModals: Array.from(document.querySelectorAll('[class*="modal"]')).map(m => ({
        className: m.className,
        display: window.getComputedStyle(m).display,
        visibility: window.getComputedStyle(m).visibility
      }))
    };
  });

  console.log('Modal check:', JSON.stringify(modalVisible, null, 2));

  console.log('\nStep 6: Checking for any edit-related elements...');
  const editElements = await page.evaluate(() => {
    return {
      inputFields: document.querySelectorAll('input[type="text"], input[type="number"]').length,
      textareas: document.querySelectorAll('textarea').length,
      editingClass: document.querySelector('.editing') ? true : false,
      focusedElement: document.activeElement?.tagName,
      focusedId: document.activeElement?.id
    };
  });

  console.log('Edit elements:', editElements);

  console.log('\nStep 7: Taking screenshot...');
  await page.screenshot({ path: '/tmp/planner-edit-test.png', fullPage: true });
  console.log('Screenshot saved to /tmp/planner-edit-test.png');

  if (!modalVisible.hasModal && !modalVisible.hasEditForm && !editElements.editingClass) {
    console.log('\n❌ EDIT FUNCTIONALITY NOT WORKING - No edit UI appeared after double-click');
  } else {
    console.log('\n✅ Edit UI appeared!');
  }

  console.log('\n⏸️  Browser will stay open for 20 seconds...');
  await page.waitForTimeout(20000);

  await browser.close();
})();
