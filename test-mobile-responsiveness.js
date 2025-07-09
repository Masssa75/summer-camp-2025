const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing mobile responsiveness fixes...');
  
  const browser = await chromium.launch({ headless: false });
  
  // Test on iPhone 12 Pro
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    console.log('Loading local development server...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Test 1: Check viewport width
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    console.log(`Viewport width: ${viewportWidth}px`);
    console.log(`Document width: ${documentWidth}px`);
    
    if (documentWidth > viewportWidth) {
      console.error(`❌ Horizontal scroll detected! Document is ${documentWidth - viewportWidth}px wider than viewport`);
    } else {
      console.log('✅ No horizontal scroll detected');
    }
    
    // Test 2: Check navigation layout
    const navHeight = await page.locator('.top-navigation').evaluate(el => el.offsetHeight);
    console.log(`Navigation height: ${navHeight}px`);
    
    // Test 3: Check for overflowing images
    const overflowingImages = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const overflowing = [];
      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.right > window.innerWidth || rect.width > window.innerWidth) {
          overflowing.push({
            src: img.src,
            width: rect.width,
            right: rect.right
          });
        }
      });
      return overflowing;
    });
    
    if (overflowingImages.length > 0) {
      console.error('❌ Found overflowing images:');
      overflowingImages.forEach(img => {
        console.error(`  - ${img.src.split('/').pop()}: width=${img.width}px, right=${img.right}px`);
      });
    } else {
      console.log('✅ All images fit within viewport');
    }
    
    // Test 4: Take screenshots
    await page.screenshot({ path: 'mobile-hero-section.png', fullPage: false });
    console.log('📸 Screenshot saved: mobile-hero-section.png');
    
    // Scroll to photo carousel
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'mobile-photo-carousel.png', fullPage: false });
    console.log('📸 Screenshot saved: mobile-photo-carousel.png');
    
    // Test 5: Check text overflow
    const textOverflow = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, p, .highlight-banner');
      const overflowing = [];
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          overflowing.push({
            tag: el.tagName,
            text: el.textContent.substring(0, 50),
            width: rect.width
          });
        }
      });
      return overflowing;
    });
    
    if (textOverflow.length > 0) {
      console.error('❌ Found overflowing text elements:');
      textOverflow.forEach(el => {
        console.error(`  - <${el.tag}>: "${el.text}..." (${el.width}px)`);
      });
    } else {
      console.log('✅ All text fits within viewport');
    }
    
  } catch (error) {
    console.error('Error during testing:', error);
  }
  
  console.log('\nPress any key to close browser...');
  await page.waitForTimeout(30000); // Keep browser open for manual inspection
  
  await browser.close();
  console.log('Test completed!');
})();