const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture all console messages
  const consoleLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(`[${msg.type()}] ${text}`);
    console.log(`[CONSOLE ${msg.type()}] ${text}`);
  });

  // Capture network requests
  const requests = [];
  page.on('request', request => {
    if (request.url().includes('supabase') || request.url().includes('financial_planner')) {
      requests.push({
        method: request.method(),
        url: request.url(),
        headers: request.headers()
      });
      console.log(`[REQUEST] ${request.method()} ${request.url()}`);
    }
  });

  // Capture network responses
  page.on('response', async response => {
    if (response.url().includes('supabase') || response.url().includes('financial_planner')) {
      try {
        const body = await response.text();
        console.log(`[RESPONSE] ${response.status()} ${response.url()}`);
        console.log(`[RESPONSE BODY] ${body.substring(0, 500)}...`);
      } catch (e) {
        console.log(`[RESPONSE] ${response.status()} ${response.url()} (couldn't read body)`);
      }
    }
  });

  console.log('\n🔍 DEBUGGING DATA LOADING ISSUE\n');

  try {
    console.log('Step 1: Loading planner...');
    await page.goto('https://phuketsummercamp.com/planner.html');
    await page.waitForTimeout(2000);

    console.log('\nStep 2: Checking localStorage before login...');
    const localStorageBefore = await page.evaluate(() => {
      return JSON.stringify(localStorage);
    });
    console.log('localStorage before login:', localStorageBefore);

    console.log('\nStep 3: Logging in...');
    await page.fill('#loginPassword', 'donkey');
    await page.click('button:has-text("Login")');
    await page.waitForTimeout(2000);

    console.log('\nStep 4: Checking localStorage after login...');
    const localStorageAfter = await page.evaluate(() => {
      return JSON.stringify(localStorage);
    });
    console.log('localStorage after login:', localStorageAfter);

    console.log('\nStep 5: Checking what getUserId() returns...');
    const userId = await page.evaluate(() => {
      return window.getUserId ? window.getUserId() : 'FUNCTION NOT FOUND';
    });
    console.log('getUserId() returns:', userId);

    console.log('\nStep 6: Waiting for data to load...');
    await page.waitForTimeout(3000);

    console.log('\nStep 7: Checking what data is in the page state...');
    const pageState = await page.evaluate(() => {
      return {
        events: window.events ? window.events.length : 'events variable not found',
        hasChart: !!document.querySelector('canvas'),
        hasEventsList: !!document.querySelector('.event-item'),
        endingBalanceExists: !!document.querySelector('#endingBalance'),
        endingBalanceText: document.querySelector('#endingBalance')?.textContent || 'NOT FOUND'
      };
    });
    console.log('Page state:', pageState);

    console.log('\nStep 8: Manually calling loadData() and checking result...');
    const loadDataResult = await page.evaluate(async () => {
      try {
        if (typeof loadData === 'function') {
          await loadData();
          return {
            success: true,
            eventsCount: window.events ? window.events.length : 0,
            events: window.events || []
          };
        } else {
          return { success: false, error: 'loadData function not found' };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    console.log('loadData() result:', JSON.stringify(loadDataResult, null, 2));

    console.log('\n📊 SUMMARY:');
    console.log('- Console logs captured:', consoleLogs.length);
    console.log('- Network requests made:', requests.length);
    console.log('- Events loaded:', loadDataResult.eventsCount || 0);
    console.log('- Chart rendered:', pageState.hasChart);

    console.log('\n⏸️  Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }

  await browser.close();
})();
