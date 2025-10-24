const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('\n🔍 TESTING CHART BUBBLE DOUBLE-CLICK EDIT\n');

  page.on('console', msg => console.log(`[CONSOLE] ${msg.text()}`));

  console.log('Step 1: Loading planner and logging in...');
  await page.goto('https://phuketsummercamp.com/planner.html');
  await page.fill('#loginPassword', 'donkey');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(3000);

  console.log('\nStep 2: Looking for chart canvas...');
  const canvas = await page.locator('canvas#chart');
  const canvasExists = await canvas.count();
  console.log(`  Canvas found: ${canvasExists > 0 ? 'Yes' : 'No'}`);

  if (canvasExists === 0) {
    console.log('❌ No canvas found!');
    await browser.close();
    return;
  }

  console.log('\nStep 3: Getting canvas position and clicking on a chart bubble...');
  const canvasBox = await canvas.boundingBox();
  console.log(`  Canvas size: ${canvasBox.width}x${canvasBox.height}`);

  // Click near the first data point (approximately where Oct 21 starting balance would be)
  // This is roughly at the left side of the chart, mid-height
  const clickX = canvasBox.x + 100;
  const clickY = canvasBox.y + canvasBox.height / 2;

  console.log(`  Double-clicking at position: (${clickX}, ${clickY})`);
  await page.mouse.dblclick(clickX, clickY);
  await page.waitForTimeout(1500);

  console.log('\nStep 4: Checking for modal/edit dialog...');
  const modalInfo = await page.evaluate(() => {
    const modal = document.querySelector('.modal');
    const modalContent = modal?.querySelector('.modal-content');

    return {
      modalExists: !!modal,
      modalDisplay: modal ? window.getComputedStyle(modal).display : 'none',
      modalOpacity: modal ? window.getComputedStyle(modal).opacity : '0',
      hasActiveClass: modal ? modal.classList.contains('active') : false,
      modalHTML: modalContent ? modalContent.innerHTML.substring(0, 500) : 'No content',
      inputFields: Array.from(document.querySelectorAll('.modal input')).map(i => ({
        id: i.id,
        type: i.type,
        value: i.value,
        placeholder: i.placeholder
      }))
    };
  });

  console.log('Modal info:', JSON.stringify(modalInfo, null, 2));

  console.log('\nStep 5: Taking screenshot...');
  await page.screenshot({ path: '/tmp/planner-chart-edit.png', fullPage: true });
  console.log('Screenshot: /tmp/planner-chart-edit.png');

  if (modalInfo.modalDisplay === 'none' || modalInfo.modalOpacity === '0') {
    console.log('\n❌ FAILED: Modal not visible after double-clicking chart');
  } else {
    console.log('\n✅ SUCCESS: Modal appeared!');
  }

  console.log('\n⏸️  Keeping browser open for 30 seconds...');
  await page.waitForTimeout(30000);

  await browser.close();
})();
