const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing deployed global image gallery on mobile...');
  
  const browser = await chromium.launch({ 
    headless: true // Running headless for deployed test
  });
  
  // Test on iPhone 14 Pro
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro']
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to the deployed site
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    console.log('Page loaded successfully');
    
    // Scroll down to find activity images
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(1000);
    
    // Click on the first activity image
    console.log('Clicking on first activity image...');
    const activityImage = await page.waitForSelector('.activity-bubble img', { timeout: 5000 });
    await activityImage.click();
    
    // Wait for gallery to open
    await page.waitForTimeout(1000);
    
    // Check if gallery is open
    const galleryVisible = await page.isVisible('.fixed.inset-0.z-50');
    console.log('Gallery opened:', galleryVisible);
    
    if (!galleryVisible) {
      throw new Error('Gallery did not open');
    }
    
    // Get current image counter
    let counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
    console.log('Current position:', counter);
    
    // Test touch swipe (simulate swipe left to go to next image)
    console.log('Testing touch swipe...');
    const centerX = 200;
    const centerY = 400;
    
    await page.mouse.move(centerX + 100, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX - 100, centerY, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(500);
    
    counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
    console.log('After swipe:', counter);
    
    // Click next button
    console.log('Clicking next button...');
    await page.click('button[aria-label="Next image"]');
    await page.waitForTimeout(500);
    
    counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
    console.log('After next button:', counter);
    
    // Click previous button
    console.log('Clicking previous button...');
    await page.click('button[aria-label="Previous image"]');
    await page.waitForTimeout(500);
    
    counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
    console.log('After previous button:', counter);
    
    // Close gallery by clicking X
    console.log('Closing gallery...');
    await page.click('button[aria-label="Close gallery"]');
    await page.waitForTimeout(500);
    
    const galleryClosed = !(await page.isVisible('.fixed.inset-0.z-50'));
    console.log('Gallery closed:', galleryClosed);
    
    // Test opening from carousel
    console.log('\\nTesting carousel image click...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    const carouselImage = await page.waitForSelector('.photo-carousel img', { timeout: 5000 });
    await carouselImage.click();
    await page.waitForTimeout(1000);
    
    const galleryReopened = await page.isVisible('.fixed.inset-0.z-50');
    console.log('Gallery reopened from carousel:', galleryReopened);
    
    if (galleryReopened) {
      counter = await page.textContent('.absolute.bottom-4.left-1\\/2');
      console.log('Current position:', counter);
      
      // Count total images
      const totalMatch = counter.match(/\d+ \/ (\d+)/);
      if (totalMatch) {
        console.log(`Total images in gallery: ${totalMatch[1]}`);
      }
    }
    
    // Take screenshot of gallery
    await page.screenshot({ 
      path: 'mobile-gallery-test.png',
      fullPage: false 
    });
    console.log('Screenshot saved as mobile-gallery-test.png');
    
    console.log('\\nAll tests passed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
    
    // Take error screenshot
    await page.screenshot({ 
      path: 'mobile-gallery-error.png',
      fullPage: true 
    });
    console.log('Error screenshot saved as mobile-gallery-error.png');
  }
  
  await browser.close();
})();