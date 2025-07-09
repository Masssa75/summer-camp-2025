const { chromium } = require('playwright');

(async () => {
  console.log('Testing global image gallery functionality...');
  
  const browser = await chromium.launch({ 
    headless: false,
    viewport: { width: 390, height: 844 } // iPhone 14 Pro
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to the site
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Click on the first activity image (slide 4)
    console.log('Clicking on first activity image...');
    await page.click('.activity-bubble img:first-of-type');
    
    // Wait for gallery to open
    await page.waitForTimeout(1000);
    
    // Check if gallery is open
    const galleryVisible = await page.isVisible('.fixed.inset-0.z-50');
    console.log('Gallery opened:', galleryVisible);
    
    // Get current image counter
    let counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
    console.log('Current position:', counter);
    
    // Click next button
    console.log('Clicking next button...');
    await page.click('button[aria-label="Next image"]');
    await page.waitForTimeout(500);
    
    counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
    console.log('After next:', counter);
    
    // Click next several more times to test navigation through all images
    for (let i = 0; i < 5; i++) {
      await page.click('button[aria-label="Next image"]');
      await page.waitForTimeout(300);
      counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
      console.log(`Position after click ${i + 2}:`, counter);
    }
    
    // Test previous button
    console.log('Testing previous button...');
    await page.click('button[aria-label="Previous image"]');
    await page.waitForTimeout(500);
    counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
    console.log('After previous:', counter);
    
    // Test keyboard navigation
    console.log('Testing keyboard navigation...');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
    console.log('After right arrow:', counter);
    
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);
    counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
    console.log('After left arrow:', counter);
    
    // Close gallery
    console.log('Closing gallery...');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    const galleryClosed = !(await page.isVisible('.fixed.inset-0.z-50'));
    console.log('Gallery closed:', galleryClosed);
    
    // Test clicking on a carousel image
    console.log('\\nTesting carousel image click...');
    await page.click('.photo-carousel img:first-of-type');
    await page.waitForTimeout(1000);
    
    const galleryReopened = await page.isVisible('.fixed.inset-0.z-50');
    console.log('Gallery reopened from carousel:', galleryReopened);
    
    counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
    console.log('Current position:', counter);
    
    // Navigate to see if we can access all images
    console.log('\\nNavigating through all images...');
    let totalImages = 0;
    const seenPositions = new Set();
    
    for (let i = 0; i < 50; i++) { // Try up to 50 clicks to find all images
      counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
      const [current, total] = counter.split(' / ');
      totalImages = parseInt(total);
      seenPositions.add(current);
      
      if (seenPositions.size === totalImages) {
        console.log(`Found all ${totalImages} images!`);
        break;
      }
      
      await page.click('button[aria-label="Next image"]');
      await page.waitForTimeout(200);
    }
    
    console.log(`Total unique positions seen: ${seenPositions.size} out of ${totalImages}`);
    
    console.log('\\nTest completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
  
  // Keep browser open for manual inspection
  console.log('\\nBrowser will remain open for manual inspection...');
  await page.waitForTimeout(60000);
  
  await browser.close();
})();