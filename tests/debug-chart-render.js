const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('\n🔍 DEBUGGING CHART RENDERING\n');

  // Capture ALL console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error' || type === 'warning' || text.includes('chart') || text.includes('annotation')) {
      console.log(`[BROWSER ${type.toUpperCase()}]:`, text);
    }
  });

  page.on('pageerror', error => {
    console.log('❌ PAGE ERROR:', error.message);
    console.log('Stack:', error.stack);
  });

  await page.goto('https://phuketsummercamp.com/planner.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Step 1: Logging in...');
  await page.fill('#loginPassword', 'donkey');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(5000);

  console.log('\nStep 2: Checking chart state...');

  const chartState = await page.evaluate(() => {
    return {
      chartExists: !!window.financialChart,
      chartType: window.financialChart?.config?.type,
      dataLabelsCount: window.financialChart?.data?.labels?.length,
      datasetCount: window.financialChart?.data?.datasets?.length,
      hasAnnotationPlugin: !!window.financialChart?.options?.plugins?.annotation,
      annotationCount: window.financialChart?.options?.plugins?.annotation?.annotations ?
        Object.keys(window.financialChart.options.plugins.annotation.annotations).length : 0,
      scales: window.financialChart?.scales ? Object.keys(window.financialChart.scales) : []
    };
  });

  console.log('\n=== CHART STATE ===');
  console.log('Chart exists:', chartState.chartExists);
  console.log('Chart type:', chartState.chartType);
  console.log('Data labels:', chartState.dataLabelsCount);
  console.log('Datasets:', chartState.datasetCount);
  console.log('Has annotation plugin:', chartState.hasAnnotationPlugin);
  console.log('Annotation count:', chartState.annotationCount);
  console.log('Scales:', chartState.scales);

  await page.screenshot({ path: '/tmp/planner-chart-debug.png', fullPage: true });
  console.log('\nScreenshot: /tmp/planner-chart-debug.png');

  console.log('\n⏸️  Keeping browser open for inspection (30s)...');
  await page.waitForTimeout(30000);

  await browser.close();
})();
