const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing final background image fix...');
  
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
    // Force no cache
    extraHTTPHeaders: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
  
  const page = await context.newPage();
  
  try {
    // Load with cache bypass
    await page.goto(`https://phuketsummercamp.com?t=${Date.now()}`, { 
      waitUntil: 'networkidle' 
    });
    
    // Test slide 2 specifically
    await page.evaluate(() => {
      document.querySelector('.slide-2')?.scrollIntoView();
    });
    
    await page.waitForTimeout(1000);
    
    // Check the actual CSS being applied
    const cssAnalysis = await page.evaluate(() => {
      const slide2 = document.querySelector('.slide-2');
      const bgLayer = slide2?.querySelector('.background-layer');
      const bgImg = slide2?.querySelector('.background-layer img');
      
      const slideRect = slide2?.getBoundingClientRect();
      const bgImgRect = bgImg?.getBoundingClientRect();
      const bgImgComputed = bgImg ? window.getComputedStyle(bgImg) : null;
      
      // Check if image covers full width
      const viewportWidth = window.innerWidth;
      const imageCoversWidth = bgImgRect && bgImgRect.width >= viewportWidth;
      
      // Calculate visible gap
      const visibleGap = bgImgRect && slideRect ? bgImgRect.top - slideRect.top : 0;
      
      return {
        viewport: {
          width: viewportWidth,
          height: window.innerHeight
        },
        slide: {
          height: slideRect?.height,
          top: slideRect?.top
        },
        backgroundImage: {
          width: bgImgRect?.width,
          height: bgImgRect?.height,
          top: bgImgRect?.top,
          computedWidth: bgImgComputed?.width,
          computedHeight: bgImgComputed?.height,
          objectPosition: bgImgComputed?.objectPosition,
          objectFit: bgImgComputed?.objectFit
        },
        analysis: {
          imageCoversWidth,
          hasVisibleGap: visibleGap > 0,
          gapSize: visibleGap
        }
      };
    });
    
    console.log('CSS Analysis:', JSON.stringify(cssAnalysis, null, 2));
    
    // Visual status
    const status = cssAnalysis.analysis.imageCoversWidth && !cssAnalysis.analysis.hasVisibleGap ? '✅' : '❌';
    console.log(`\n${status} Background image status:`);
    console.log(`- Covers full width: ${cssAnalysis.analysis.imageCoversWidth ? 'YES' : 'NO'}`);
    console.log(`- Has visible gap: ${cssAnalysis.analysis.hasVisibleGap ? 'YES' : 'NO'}`);
    if (cssAnalysis.analysis.hasVisibleGap) {
      console.log(`- Gap size: ${cssAnalysis.analysis.gapSize}px`);
    }
    
    await page.screenshot({ path: 'final-fix-test.png', fullPage: false });
    console.log('\n📸 Screenshot saved');
    
    console.log('Browser will close in 30 seconds...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();