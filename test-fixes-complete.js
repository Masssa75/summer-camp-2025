const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing activity image fixes...');
  
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto(`https://phuketsummercamp.com?t=${Date.now()}`, { 
      waitUntil: 'networkidle' 
    });
    
    // Test 1: Activity bubble centering
    await page.evaluate(() => {
      const wonderSlide = Array.from(document.querySelectorAll('.slide')).find(slide => 
        slide.textContent.includes('A Summer of Wonder')
      );
      if (wonderSlide) wonderSlide.scrollIntoView({ behavior: 'smooth' });
    });
    
    await page.waitForTimeout(1500);
    
    const centeringCheck = await page.evaluate(() => {
      const bubbles = document.querySelectorAll('.activity-bubble');
      const results = [];
      
      bubbles.forEach((bubble, i) => {
        const computed = window.getComputedStyle(bubble);
        results.push({
          index: i,
          display: computed.display,
          alignItems: computed.alignItems,
          justifyContent: computed.justifyContent,
          overflow: computed.overflow
        });
      });
      
      return results;
    });
    
    console.log('Activity bubble centering:');
    centeringCheck.forEach((item, i) => {
      const isProperlyStyled = item.display === 'flex' && 
                               item.alignItems === 'center' && 
                               item.justifyContent === 'center';
      console.log(`${isProperlyStyled ? '✅' : '❌'} Bubble ${i}: ${item.display}, ${item.alignItems}, ${item.justifyContent}`);
    });
    
    // Test 2: Full-screen expansion
    console.log('\nTesting full-screen expansion...');
    
    // Click on an activity image
    await page.click('.activity-bubble img');
    await page.waitForTimeout(1000);
    
    const expansionTest = await page.evaluate(() => {
      // Look for the portal-rendered overlay
      const overlays = Array.from(document.querySelectorAll('div')).filter(div => 
        div.style.position === 'fixed' && 
        div.style.zIndex === '9999'
      );
      
      if (overlays.length === 0) {
        return { error: 'No portal overlay found' };
      }
      
      const overlay = overlays[0];
      const rect = overlay.getBoundingClientRect();
      const expandedImg = overlay.querySelector('img[style*="maxWidth"]');
      const imgRect = expandedImg?.getBoundingClientRect();
      
      return {
        overlay: {
          width: rect.width,
          height: rect.height,
          coversViewport: rect.width === window.innerWidth && rect.height === window.innerHeight
        },
        image: expandedImg ? {
          width: imgRect.width,
          height: imgRect.height,
          withinViewport: imgRect.width <= window.innerWidth && imgRect.height <= window.innerHeight
        } : null,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });
    
    console.log('\nExpansion test:', JSON.stringify(expansionTest, null, 2));
    
    if (expansionTest.overlay?.coversViewport) {
      console.log('✅ Overlay covers full viewport');
    } else {
      console.log('❌ Overlay does not cover full viewport');
    }
    
    await page.screenshot({ path: 'activity-fixes-complete.png', fullPage: false });
    
    // Close the expanded image
    await page.click('button[aria-label="Close image"]');
    await page.waitForTimeout(500);
    
    console.log('\n📸 Screenshot saved');
    console.log('Browser will close in 30 seconds...');
    
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();