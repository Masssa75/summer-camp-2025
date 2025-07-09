const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing mobile responsiveness on deployed site...');
  
  const browser = await chromium.launch({ headless: true });
  
  // Test on iPhone 12 Pro
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    console.log('Loading deployed site...');
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Test 1: Check viewport width vs document width
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    console.log(`\n📏 Viewport width: ${viewportWidth}px`);
    console.log(`📏 Document width: ${documentWidth}px`);
    
    if (documentWidth > viewportWidth) {
      console.error(`❌ FAIL: Horizontal scroll detected! Document is ${documentWidth - viewportWidth}px wider than viewport`);
    } else {
      console.log('✅ PASS: No horizontal scroll detected');
    }
    
    // Test 2: Check navigation layout height
    const navHeight = await page.locator('.top-navigation').evaluate(el => el.offsetHeight);
    console.log(`\n📐 Navigation height: ${navHeight}px`);
    if (navHeight > 150) {
      console.error('❌ FAIL: Navigation is too tall on mobile');
    } else {
      console.log('✅ PASS: Navigation height is reasonable');
    }
    
    // Test 3: Check for overflowing images
    const overflowingImages = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const overflowing = [];
      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.right > window.innerWidth || rect.width > window.innerWidth) {
          overflowing.push({
            src: img.src,
            width: Math.round(rect.width),
            right: Math.round(rect.right),
            class: img.className
          });
        }
      });
      return overflowing;
    });
    
    console.log(`\n🖼️  Checking images...`);
    if (overflowingImages.length > 0) {
      console.error(`❌ FAIL: Found ${overflowingImages.length} overflowing images:`);
      overflowingImages.forEach(img => {
        console.error(`  - ${img.src.split('/').pop()}: width=${img.width}px, class="${img.class}"`);
      });
    } else {
      console.log('✅ PASS: All images fit within viewport');
    }
    
    // Test 4: Check text overflow
    const textOverflow = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, p, .highlight-banner');
      const overflowing = [];
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          overflowing.push({
            tag: el.tagName,
            text: el.textContent.substring(0, 30),
            width: Math.round(rect.width),
            class: el.className
          });
        }
      });
      return overflowing;
    });
    
    console.log(`\n📝 Checking text elements...`);
    if (textOverflow.length > 0) {
      console.error(`❌ FAIL: Found ${textOverflow.length} overflowing text elements:`);
      textOverflow.forEach(el => {
        console.error(`  - <${el.tag} class="${el.class}">: "${el.text}..." (${el.width}px)`);
      });
    } else {
      console.log('✅ PASS: All text fits within viewport');
    }
    
    // Test 5: Take screenshots for visual verification
    await page.screenshot({ path: 'mobile-test-hero.png', fullPage: false });
    console.log('\n📸 Screenshot saved: mobile-test-hero.png');
    
    // Scroll to photo carousel area
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'mobile-test-carousel.png', fullPage: false });
    console.log('📸 Screenshot saved: mobile-test-carousel.png');
    
    // Test 6: Check specific problem areas from user screenshots
    console.log(`\n🔍 Checking specific problem areas...`);
    
    // Check hero text that was overflowing
    const heroTextOverflow = await page.evaluate(() => {
      const heroElements = document.querySelectorAll('.hero-content, .hero-left, .hero-title');
      return Array.from(heroElements).some(el => {
        const rect = el.getBoundingClientRect();
        return rect.right > window.innerWidth;
      });
    });
    
    if (heroTextOverflow) {
      console.error('❌ FAIL: Hero section text is still overflowing');
    } else {
      console.log('✅ PASS: Hero section text fits properly');
    }
    
    // Summary
    const allTestsPassed = documentWidth <= viewportWidth && 
                          navHeight <= 150 && 
                          overflowingImages.length === 0 && 
                          textOverflow.length === 0 &&
                          !heroTextOverflow;
    
    console.log('\n' + '='.repeat(50));
    if (allTestsPassed) {
      console.log('✅ ALL TESTS PASSED! Mobile responsiveness is fixed.');
    } else {
      console.error('❌ SOME TESTS FAILED. Mobile responsiveness needs more work.');
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('Error during testing:', error);
  }
  
  await browser.close();
})();