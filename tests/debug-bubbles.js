const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('\n🔍 DEBUGGING BUBBLE RENDERING\n');

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('❌ PAGE ERROR:', error.message);
  });

  await page.goto('https://phuketsummercamp.com/planner.html');
  await page.waitForTimeout(1000);

  console.log('Step 1: Logging in...');
  await page.fill('#loginPassword', 'donkey');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(5000);

  console.log('\nStep 2: Inspecting chart annotations...');

  const debugInfo = await page.evaluate(() => {
    const chart = window.financialChart;

    if (!chart) {
      return { error: 'Chart not found' };
    }

    const annotations = chart.options?.plugins?.annotation?.annotations;

    if (!annotations) {
      return { error: 'No annotations object' };
    }

    const annotationKeys = Object.keys(annotations);
    const annotationValues = Object.values(annotations);

    // Get chart Y scale info
    const yScale = chart.scales?.y;
    const yMin = yScale?.min;
    const yMax = yScale?.max;

    // Analyze each annotation
    const bubbleDetails = annotationValues
      .filter(a => a.type === 'label')
      .map(a => ({
        content: a.content?.[0] || 'Unknown',
        xValue: a.xValue,
        yValue: a.yValue,
        display: a.display,
        inBounds: a.yValue >= yMin && a.yValue <= yMax
      }));

    return {
      annotationCount: annotationKeys.length,
      bubbleCount: bubbleDetails.length,
      yMin,
      yMax,
      yRange: yMax - yMin,
      bubbles: bubbleDetails.slice(0, 5),
      outOfBounds: bubbleDetails.filter(b => !b.inBounds).length
    };
  });

  console.log('\n=== DEBUG INFO ===');
  console.log('Annotation count:', debugInfo.annotationCount);
  console.log('Bubble count:', debugInfo.bubbleCount);
  console.log('Chart Y range:', debugInfo.yMin, 'to', debugInfo.yMax);
  console.log('Range:', debugInfo.yRange);
  console.log('Bubbles out of bounds:', debugInfo.outOfBounds);

  if (debugInfo.bubbles) {
    console.log('\nFirst 5 bubbles:');
    debugInfo.bubbles.forEach((b, i) => {
      console.log(`  ${i + 1}. ${b.content}:`);
      console.log(`     Y: ${b.yValue?.toLocaleString()}`);
      console.log(`     In bounds: ${b.inBounds}`);
      console.log(`     Display: ${b.display !== false}`);
    });
  }

  await page.screenshot({ path: '/tmp/planner-debug-bubbles.png', fullPage: true });
  console.log('\nScreenshot: /tmp/planner-debug-bubbles.png');

  console.log('\n⏸️  Browser open for 30s...');
  await page.waitForTimeout(30000);

  await browser.close();
})();
