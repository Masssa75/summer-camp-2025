const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('\n🔍 TESTING DELETE BUTTON IN EDIT MODAL\n');

  await page.goto('https://phuketsummercamp.com/planner.html');
  await page.fill('#loginPassword', 'donkey');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(3000);

  console.log('Step 1: Double-clicking first event to open edit modal...');
  const firstEvent = page.locator('.event-item').first();
  await firstEvent.dblclick();
  await page.waitForTimeout(1000);

  console.log('\nStep 2: Checking if modal opened and delete button is visible...');
  const modalInfo = await page.evaluate(() => {
    const modal = document.getElementById('eventModal');
    const deleteBtn = document.getElementById('deleteBtn');
    const duplicateBtn = document.getElementById('duplicateBtn');
    const modalTitle = document.getElementById('modalTitle');

    return {
      modalActive: modal?.classList.contains('active'),
      modalTitle: modalTitle?.textContent,
      deleteBtnVisible: deleteBtn ? window.getComputedStyle(deleteBtn).display !== 'none' : false,
      deleteBtnText: deleteBtn?.textContent,
      deleteBtnColor: deleteBtn ? window.getComputedStyle(deleteBtn).backgroundColor : null,
      duplicateBtnVisible: duplicateBtn ? window.getComputedStyle(duplicateBtn).display !== 'none' : false
    };
  });

  console.log('Modal info:', JSON.stringify(modalInfo, null, 2));

  console.log('\nStep 3: Taking screenshot of edit modal with delete button...');
  await page.screenshot({ path: '/tmp/planner-delete-button.png', fullPage: true });
  console.log('Screenshot: /tmp/planner-delete-button.png');

  if (modalInfo.modalActive && modalInfo.deleteBtnVisible) {
    console.log('\n✅ SUCCESS: Delete button is visible in edit modal!');
    console.log(`   Button text: "${modalInfo.deleteBtnText}"`);
    console.log(`   Button color: ${modalInfo.deleteBtnColor} (should be red)`);
  } else {
    console.log('\n❌ FAILED: Delete button not visible or modal not active');
    console.log('   Modal active:', modalInfo.modalActive);
    console.log('   Delete button visible:', modalInfo.deleteBtnVisible);
  }

  console.log('\n⏸️  Keeping browser open for 30 seconds...');
  await page.waitForTimeout(30000);

  await browser.close();
})();
