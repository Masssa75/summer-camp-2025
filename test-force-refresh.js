const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing with forced refresh...');
  
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
    // Disable cache
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  
  const page = await context.newPage();
  
  try {
    // Add timestamp to bypass cache
    const timestamp = Date.now();
    await page.goto(`https://phuketsummercamp.com?_=${timestamp}`, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Force clear any service workers
    await page.evaluate(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(reg => reg.unregister());
        });
      }
    });
    
    // Hard reload
    await page.reload({ waitUntil: 'networkidle' });
    
    // Scroll to slide 2
    await page.evaluate(() => {
      const slide2 = document.querySelector('.slide-2');
      if (slide2) slide2.scrollIntoView();
    });
    
    await page.waitForTimeout(1000);
    
    // Check actual computed styles
    const check = await page.evaluate(() => {
      const bgImg = document.querySelector('.slide-2 .background-layer img');
      const carousel = document.querySelector('.slide-2 .photo-carousel');
      
      const bgComputed = bgImg ? window.getComputedStyle(bgImg) : null;
      const carouselComputed = carousel ? window.getComputedStyle(carousel) : null;
      
      return {
        backgroundImage: {
          objectPosition: bgComputed?.objectPosition,
          width: bgComputed?.width,
          height: bgComputed?.height,
          maxWidth: bgComputed?.maxWidth
        },
        carousel: {
          marginTop: carouselComputed?.marginTop
        },
        bodyPaddingTop: window.getComputedStyle(document.body).paddingTop
      };
    });
    
    console.log('Current styles:', JSON.stringify(check, null, 2));
    
    await page.screenshot({ path: 'force-refresh-test.png', fullPage: false });
    console.log('Screenshot saved');
    
    console.log('\nKeeping browser open for manual inspection...');
    console.log('Try pressing Cmd+Shift+R to force refresh in the browser');
    
    await page.waitForTimeout(60000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();