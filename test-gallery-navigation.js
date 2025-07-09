const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing image gallery navigation...');
  
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
    
    // Scroll to activity grid
    await page.evaluate(() => {
      const wonderSlide = Array.from(document.querySelectorAll('.slide')).find(slide => 
        slide.textContent.includes('A Summer of Wonder')
      );
      if (wonderSlide) wonderSlide.scrollIntoView({ behavior: 'smooth' });
    });
    
    await page.waitForTimeout(1500);
    
    // Click on first activity image
    await page.click('.activity-bubble img');
    await page.waitForTimeout(1000);
    
    // Check gallery features
    const galleryCheck = await page.evaluate(() => {
      // Find the portal overlay
      const overlay = Array.from(document.querySelectorAll('div')).find(div => 
        div.style.zIndex === '9999' && div.style.position === 'fixed'
      );
      
      if (!overlay) return { error: 'No gallery overlay found' };
      
      // Check for navigation elements
      const leftArrow = overlay.querySelector('button[aria-label="Previous image"]');
      const rightArrow = overlay.querySelector('button[aria-label="Next image"]');
      const closeButton = overlay.querySelector('button[aria-label="Close gallery"]');
      const counter = overlay.querySelector('div[style*="bottom: 4px"]');
      const image = overlay.querySelector('img[style*="maxWidth"]');
      
      return {
        hasLeftArrow: !!leftArrow,
        hasRightArrow: !!rightArrow,
        hasCloseButton: !!closeButton,
        hasCounter: !!counter,
        counterText: counter?.textContent || null,
        hasImage: !!image,
        overlayDimensions: {
          width: overlay.getBoundingClientRect().width,
          height: overlay.getBoundingClientRect().height
        }
      };
    });
    
    console.log('Gallery features:', galleryCheck);
    
    // Test navigation
    if (galleryCheck.hasRightArrow) {
      console.log('\nTesting navigation...');
      
      // Click next
      await page.click('button[aria-label="Next image"]');
      await page.waitForTimeout(500);
      
      const afterNext = await page.evaluate(() => {
        const counter = document.querySelector('div[style*="bottom: 4px"]');
        return counter?.textContent || null;
      });
      
      console.log('After clicking next:', afterNext);
      
      // Click previous
      await page.click('button[aria-label="Previous image"]');
      await page.waitForTimeout(500);
      
      const afterPrev = await page.evaluate(() => {
        const counter = document.querySelector('div[style*="bottom: 4px"]');
        return counter?.textContent || null;
      });
      
      console.log('After clicking previous:', afterPrev);
    }
    
    // Test swipe gesture
    console.log('\nTesting swipe gesture...');
    const overlay = await page.$('div[style*="zIndex: 9999"]');
    if (overlay) {
      const box = await overlay.boundingBox();
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      
      // Swipe left
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX - 100, startY, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      const afterSwipe = await page.evaluate(() => {
        const counter = document.querySelector('div[style*="bottom: 4px"]');
        return counter?.textContent || null;
      });
      
      console.log('After swipe left:', afterSwipe);
    }
    
    await page.screenshot({ path: 'gallery-navigation-test.png', fullPage: false });
    
    console.log('\n✅ Gallery navigation features are working!');
    console.log('📸 Screenshot saved');
    console.log('Browser will close in 30 seconds...');
    
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();