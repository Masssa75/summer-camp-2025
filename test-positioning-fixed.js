const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing positioning fixes...');
  
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Test multiple slides
    const slidesToTest = [1, 2, 3, 4];
    
    for (const slideNum of slidesToTest) {
      // Scroll to slide
      await page.evaluate((num) => {
        const slide = document.querySelector(`.slide-${num}`);
        if (slide) slide.scrollIntoView();
      }, slideNum);
      
      await page.waitForTimeout(500);
      
      // Analyze positioning
      const slideInfo = await page.evaluate((num) => {
        const slide = document.querySelector(`.slide-${num}`);
        const bgImg = slide?.querySelector('.background-layer img');
        const carousel = slide?.querySelector('.photo-carousel');
        
        const slideRect = slide?.getBoundingClientRect();
        const bgImgRect = bgImg?.getBoundingClientRect();
        const carouselRect = carousel?.getBoundingClientRect();
        
        const bgImgComputed = bgImg ? window.getComputedStyle(bgImg) : null;
        
        return {
          slide: num,
          hasBackgroundGap: bgImgRect && bgImgRect.top > slideRect.top,
          gapSize: bgImgRect ? bgImgRect.top - slideRect.top : 0,
          bgObjectPosition: bgImgComputed?.objectPosition,
          carouselFromTop: carouselRect ? carouselRect.top - slideRect.top : null
        };
      }, slideNum);
      
      const status = slideInfo.hasBackgroundGap ? '❌' : '✅';
      console.log(`${status} Slide ${slideNum}:`);
      if (slideInfo.hasBackgroundGap) {
        console.log(`   Background gap: ${slideInfo.gapSize}px`);
      }
      console.log(`   Object position: ${slideInfo.bgObjectPosition}`);
      if (slideInfo.carouselFromTop !== null) {
        console.log(`   Carousel distance from slide top: ${slideInfo.carouselFromTop}px`);
      }
      
      // Take screenshot
      await page.screenshot({ path: `fixed-slide${slideNum}.png`, fullPage: false });
    }
    
    console.log('\n📸 Screenshots saved');
    console.log('Keeping browser open for inspection...');
    
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();