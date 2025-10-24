const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => console.log(`[CONSOLE] ${msg.text()}`));

  console.log('\n🔍 DEBUGGING DATA OBJECT\n');

  await page.goto('https://phuketsummercamp.com/planner.html');
  await page.waitForTimeout(2000);

  console.log('Step 1: Logging in...');
  await page.fill('#loginPassword', 'donkey');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(3000);

  console.log('\nStep 2: Checking data object...');
  const dataCheck = await page.evaluate(() => {
    if (typeof data === 'undefined') {
      return { error: 'data object not found' };
    }
    return {
      eventsLength: data.events ? data.events.length : 0,
      events: data.events || [],
      timeRange: data.timeRange,
      scenario: data.scenario
    };
  });

  console.log('data object:', JSON.stringify(dataCheck, null, 2));

  console.log('\nStep 3: Checking rendered elements...');
  const elementsCheck = await page.evaluate(() => {
    return {
      eventItemsCount: document.querySelectorAll('.event-item').length,
      hasCanvas: !!document.querySelector('canvas'),
      canvasDataExists: !!document.querySelector('canvas')?.chart
    };
  });

  console.log('Rendered elements:', elementsCheck);

  console.log('\nStep 4: Manually checking loadData function...');
  const loadDataCheck = await page.evaluate(async () => {
    const userIdBefore = getUserId();
    console.log('User ID before loadData:', userIdBefore);

    // Check Supabase directly
    const { createClient } = window.supabase;
    const supabaseClient = createClient(
      'https://xunccqdrybxpwcvafvag.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bmNjcWRyeWJ4cHdjdmFmdmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1MzIzOTIsImV4cCI6MjA0OTEwODM5Mn0.tFx1vKSttDaSi7WYOZJqKN7Cp9Dg9LsHDlwCMfFdAzI'
    );

    const { data: dbData, error } = await supabaseClient
      .from('financial_planner')
      .select('*')
      .eq('user_id', userIdBefore)
      .single();

    if (error) {
      return { error: error.message, code: error.code };
    }

    return {
      dbEventsCount: dbData?.events?.length || 0,
      dbEvents: dbData?.events || [],
      userId: userIdBefore
    };
  });

  console.log('Direct Supabase query:', JSON.stringify({
    userId: loadDataCheck.userId,
    eventsCount: loadDataCheck.dbEventsCount
  }));

  console.log('\n⏸️  Browser will stay open for inspection...');
  await page.waitForTimeout(30000);

  await browser.close();
})();
