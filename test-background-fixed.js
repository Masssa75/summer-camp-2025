const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing background image fix...');
  
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Check if background images now fill properly
    const bgInfo = await page.evaluate(() => {
      const results = [];
      const slides = document.querySelectorAll('.slide');
      
      slides.forEach((slide, index) => {
        const bgImg = slide.querySelector('.background-layer img');
        if (bgImg) {
          const slideRect = slide.getBoundingClientRect();
          const imgRect = bgImg.getBoundingClientRect();
          const computed = window.getComputedStyle(bgImg);
          
          results.push({
            slide: index + 1,
            slideHeight: slideRect.height,
            imgHeight: imgRect.height,
            imgWidth: imgRect.width,
            coversFull: imgRect.height >= slideRect.height,
            objectFit: computed.objectFit,
            minHeight: computed.minHeight
          });
        }
      });
      
      return {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        backgrounds: results
      };
    });
    
    console.log('Background coverage analysis:');
    console.log(`Viewport: ${bgInfo.viewport.width}x${bgInfo.viewport.height}\n`);
    
    bgInfo.backgrounds.forEach(bg => {
      const status = bg.coversFull ? '✅' : '❌';
      console.log(`${status} Slide ${bg.slide}: Image ${bg.imgWidth}x${bg.imgHeight} / Slide height ${bg.slideHeight}`);
      console.log(`   Object-fit: ${bg.objectFit}, Min-height: ${bg.minHeight}`);
    });
    
    // Take screenshots of different sections
    await page.screenshot({ path: 'bg-fixed-hero.png', fullPage: false });
    
    // Scroll to second background
    await page.evaluate(() => {
      const slide2 = document.querySelector('.slide-2');
      if (slide2) slide2.scrollIntoView();
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'bg-fixed-slide2.png', fullPage: false });
    
    console.log('\n📸 Screenshots saved');
    console.log('Keeping browser open for 30 seconds...');
    
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();