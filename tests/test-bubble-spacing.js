const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('\n🔍 TESTING BUBBLE POSITIONING ON DEPLOYED SITE\n');

  await page.goto('https://phuketsummercamp.com/planner.html');
  await page.waitForTimeout(1000);

  console.log('Step 1: Logging in...');
  await page.fill('#loginPassword', 'donkey');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(3000);

  console.log('\nStep 2: Analyzing bubble positions...');

  // Get bubble positions from Chart.js annotations
  const bubbleInfo = await page.evaluate(() => {
    const chart = window.financialChart;
    if (!chart || !chart.options?.plugins?.annotation?.annotations) {
      return { error: 'Chart not found' };
    }

    const annotations = chart.options.plugins.annotation.annotations;
    const bubbles = Object.values(annotations).filter(a => a.type === 'label');

    // Get Y positions
    const positions = bubbles.map(b => ({
      date: b.xValue,
      yValue: b.yValue,
      content: b.content?.[0] || 'Unknown'
    }));

    // Calculate distribution
    const yValues = positions.map(p => p.yValue);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const range = maxY - minY;

    return {
      count: bubbles.length,
      positions: positions,
      minY: minY,
      maxY: maxY,
      range: range,
      averageY: yValues.reduce((a, b) => a + b, 0) / yValues.length
    };
  });

  console.log('\n=== BUBBLE ANALYSIS ===');
  console.log('Total bubbles:', bubbleInfo.count);
  console.log('Y-axis range:', bubbleInfo.range?.toLocaleString());
  console.log('Min Y:', bubbleInfo.minY?.toLocaleString());
  console.log('Max Y:', bubbleInfo.maxY?.toLocaleString());
  console.log('Average Y:', bubbleInfo.averageY?.toLocaleString());

  if (bubbleInfo.positions) {
    console.log('\nFirst 5 bubble positions:');
    bubbleInfo.positions.slice(0, 5).forEach((pos, i) => {
      console.log(`  ${i + 1}. ${pos.content}: Y = ${pos.yValue.toLocaleString()}`);
    });
  }

  console.log('\nStep 3: Taking screenshot...');
  await page.screenshot({ path: '/tmp/planner-deployed-spacing.png', fullPage: true });
  console.log('Screenshot: /tmp/planner-deployed-spacing.png');

  // Check if bubbles are properly distributed
  if (bubbleInfo.range && bubbleInfo.range > 100000) {
    console.log('\n✅ SUCCESS: Bubbles are spread vertically (range > 100k)');
  } else if (bubbleInfo.range && bubbleInfo.range < 50000) {
    console.log('\n❌ PROBLEM: Bubbles still cramped (range < 50k)');
  } else {
    console.log('\n⚠️  MODERATE: Bubbles somewhat spread (range 50k-100k)');
  }

  console.log('\n⏸️  Keeping browser open for 30 seconds...');
  await page.waitForTimeout(30000);

  await browser.close();
})();
