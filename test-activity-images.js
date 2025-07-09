const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing activity images positioning and expansion...');
  
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Find slides with activity grids
    await page.evaluate(() => {
      // Scroll to "A Summer of Wonder" slide which has activity bubbles
      const wonderSlide = Array.from(document.querySelectorAll('.slide')).find(slide => 
        slide.textContent.includes('A Summer of Wonder')
      );
      if (wonderSlide) wonderSlide.scrollIntoView();
    });
    
    await page.waitForTimeout(1000);
    
    // Analyze activity bubble positioning
    const activityAnalysis = await page.evaluate(() => {
      const activityBubbles = document.querySelectorAll('.activity-bubble');
      const results = [];
      
      activityBubbles.forEach((bubble, index) => {
        const img = bubble.querySelector('img');
        const bubbleRect = bubble.getBoundingClientRect();
        const imgRect = img?.getBoundingClientRect();
        const bubbleComputed = window.getComputedStyle(bubble);
        const imgComputed = img ? window.getComputedStyle(img) : null;
        
        results.push({
          index,
          bubble: {
            width: bubbleRect.width,
            height: bubbleRect.height,
            padding: bubbleComputed.padding,
            overflow: bubbleComputed.overflow,
            position: bubbleComputed.position
          },
          image: img ? {
            width: imgRect.width,
            height: imgRect.height,
            objectFit: imgComputed.objectFit,
            position: imgComputed.position,
            top: imgComputed.top,
            transform: imgComputed.transform
          } : null,
          hasEmptySpace: img && (bubbleRect.height - imgRect.height > 20)
        });
      });
      
      return results;
    });
    
    console.log('Activity bubbles analysis:');
    activityAnalysis.forEach((item, i) => {
      if (item.hasEmptySpace) {
        console.log(`❌ Bubble ${i}: Empty space detected`);
        console.log(`   Bubble: ${item.bubble.width}x${item.bubble.height}`);
        console.log(`   Image: ${item.image?.width}x${item.image?.height}`);
      }
    });
    
    // Test expandable image functionality
    console.log('\nTesting image expansion...');
    
    // Click on first activity image
    await page.click('.activity-bubble img');
    await page.waitForTimeout(500);
    
    // Check if expanded properly
    const expansionCheck = await page.evaluate(() => {
      const expandedOverlay = document.querySelector('.fixed.inset-0.z-50');
      const expandedImg = expandedOverlay?.querySelector('img');
      
      if (!expandedOverlay) return { error: 'No expanded overlay found' };
      
      const overlayRect = expandedOverlay.getBoundingClientRect();
      const imgRect = expandedImg?.getBoundingClientRect();
      const overlayComputed = window.getComputedStyle(expandedOverlay);
      
      return {
        overlay: {
          width: overlayRect.width,
          height: overlayRect.height,
          position: overlayComputed.position,
          inset: overlayComputed.inset,
          zIndex: overlayComputed.zIndex
        },
        image: imgRect ? {
          width: imgRect.width,
          height: imgRect.height,
          visibleInViewport: imgRect.width <= window.innerWidth && imgRect.height <= window.innerHeight
        } : null,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });
    
    console.log('\nExpansion check:', JSON.stringify(expansionCheck, null, 2));
    
    // Take screenshots
    await page.screenshot({ path: 'expanded-image-issue.png', fullPage: false });
    
    // Close expanded image
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Check another slide with activities
    await page.evaluate(() => {
      const natureSlide = Array.from(document.querySelectorAll('.slide')).find(slide => 
        slide.textContent.includes("Nature's Classroom")
      );
      if (natureSlide) natureSlide.scrollIntoView();
    });
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'nature-activities.png', fullPage: false });
    
    console.log('\n📸 Screenshots saved');
    console.log('Browser will close in 30 seconds...');
    
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();