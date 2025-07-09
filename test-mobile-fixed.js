const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing mobile fixes...');
  
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Check if fixes are applied
    const layoutInfo = await page.evaluate(() => {
      const body = document.body;
      const nav = document.querySelector('.top-navigation');
      const slide1 = document.querySelector('.slide-1');
      const bgImg = document.querySelector('.slide-1 .background-layer img');
      
      const bodyComputed = window.getComputedStyle(body);
      const navComputed = nav ? window.getComputedStyle(nav) : null;
      const navRect = nav ? nav.getBoundingClientRect() : null;
      const bgImgComputed = bgImg ? window.getComputedStyle(bgImg) : null;
      const bgImgRect = bgImg ? bgImg.getBoundingClientRect() : null;
      
      return {
        body: {
          paddingTop: bodyComputed.paddingTop,
          overflowX: bodyComputed.overflowX
        },
        nav: {
          position: navComputed?.position,
          top: navRect?.top,
          height: navRect?.height
        },
        backgroundImg: {
          width: bgImgRect?.width,
          maxWidth: bgImgComputed?.maxWidth,
          computedWidth: bgImgComputed?.width
        },
        viewport: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth
      };
    });
    
    console.log('Layout info:', JSON.stringify(layoutInfo, null, 2));
    
    // Check for horizontal scroll
    if (layoutInfo.documentWidth > layoutInfo.viewport) {
      console.log(`\n❌ Horizontal scroll detected: ${layoutInfo.documentWidth}px > ${layoutInfo.viewport}px`);
    } else {
      console.log('\n✅ No horizontal scroll');
    }
    
    // Check padding
    const paddingValue = parseInt(layoutInfo.body.paddingTop);
    if (paddingValue > 80) {
      console.log(`❌ Excessive top padding: ${layoutInfo.body.paddingTop}`);
    } else {
      console.log(`✅ Top padding is reasonable: ${layoutInfo.body.paddingTop}`);
    }
    
    // Check background image
    if (layoutInfo.backgroundImg.width >= layoutInfo.viewport) {
      console.log(`✅ Background image fills viewport: ${layoutInfo.backgroundImg.width}px`);
    } else {
      console.log(`❌ Background image too narrow: ${layoutInfo.backgroundImg.width}px < ${layoutInfo.viewport}px`);
    }
    
    // Take screenshots
    await page.screenshot({ path: 'mobile-fixed-hero.png', fullPage: false });
    
    // Scroll down to check other backgrounds
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'mobile-fixed-content.png', fullPage: false });
    
    console.log('\n📸 Screenshots saved');
    console.log('Keeping browser open for 30 seconds...');
    
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();