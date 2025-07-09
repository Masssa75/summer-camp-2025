const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing slide 2 background and carousel positioning...');
  
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Scroll to slide 2
    await page.evaluate(() => {
      const slide2 = document.querySelector('.slide-2');
      if (slide2) slide2.scrollIntoView();
    });
    
    await page.waitForTimeout(1000);
    
    // Analyze slide 2 structure
    const slide2Info = await page.evaluate(() => {
      const slide2 = document.querySelector('.slide-2');
      const bgLayer = slide2?.querySelector('.background-layer');
      const bgImg = slide2?.querySelector('.background-layer img');
      const bgOverlay = slide2?.querySelector('.background-overlay');
      const contentWrapper = slide2?.querySelector('.content-wrapper');
      const carousel = slide2?.querySelector('.photo-carousel');
      
      const slide2Rect = slide2?.getBoundingClientRect();
      const bgLayerRect = bgLayer?.getBoundingClientRect();
      const bgImgRect = bgImg?.getBoundingClientRect();
      const contentRect = contentWrapper?.getBoundingClientRect();
      const carouselRect = carousel?.getBoundingClientRect();
      
      const bgImgComputed = bgImg ? window.getComputedStyle(bgImg) : null;
      const bgLayerComputed = bgLayer ? window.getComputedStyle(bgLayer) : null;
      
      return {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          scrollY: window.scrollY
        },
        slide2: {
          top: slide2Rect?.top,
          height: slide2Rect?.height,
          visibleTop: slide2Rect?.top + window.scrollY
        },
        backgroundLayer: {
          top: bgLayerRect?.top,
          height: bgLayerRect?.height,
          position: bgLayerComputed?.position,
          inset: bgLayerComputed?.inset
        },
        backgroundImg: {
          top: bgImgRect?.top,
          height: bgImgRect?.height,
          width: bgImgRect?.width,
          naturalHeight: bgImg?.naturalHeight,
          naturalWidth: bgImg?.naturalWidth,
          objectFit: bgImgComputed?.objectFit,
          objectPosition: bgImgComputed?.objectPosition
        },
        content: {
          top: contentRect?.top,
          height: contentRect?.height,
          paddingTop: contentWrapper ? window.getComputedStyle(contentWrapper).paddingTop : null
        },
        carousel: {
          top: carouselRect?.top,
          distanceFromViewportTop: carouselRect?.top
        }
      };
    });
    
    console.log('Slide 2 analysis:', JSON.stringify(slide2Info, null, 2));
    
    // Check the CSS specifically affecting positioning
    const positioningCSS = await page.evaluate(() => {
      const slide2 = document.querySelector('.slide-2');
      const bgImg = slide2?.querySelector('.background-layer img');
      
      if (!bgImg) return null;
      
      // Get all computed styles
      const computed = window.getComputedStyle(bgImg);
      
      return {
        position: computed.position,
        top: computed.top,
        transform: computed.transform,
        objectPosition: computed.objectPosition,
        verticalAlign: computed.verticalAlign
      };
    });
    
    console.log('\nBackground image positioning CSS:', positioningCSS);
    
    // Take screenshot
    await page.screenshot({ path: 'slide2-issue.png', fullPage: false });
    
    console.log('\n📸 Screenshot saved as slide2-issue.png');
    console.log('Keeping browser open for inspection...');
    
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();