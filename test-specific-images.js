const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing specific image issues...');
  
  const browser = await chromium.launch({ headless: false }); // visible for debugging
  
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Find the specific problematic images
    const imageInfo = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const problematic = [];
      
      images.forEach(img => {
        if (img.src.includes('5.jpg') || img.src.includes('3.jpg') || img.src.includes('4.jpg')) {
          const rect = img.getBoundingClientRect();
          const computed = window.getComputedStyle(img);
          const parent = img.parentElement;
          const parentRect = parent.getBoundingClientRect();
          const parentComputed = window.getComputedStyle(parent);
          
          problematic.push({
            src: img.src.split('/').pop(),
            imgWidth: rect.width,
            imgHeight: rect.height,
            imgClass: img.className,
            imgStyle: img.getAttribute('style'),
            parentTag: parent.tagName,
            parentClass: parent.className,
            parentWidth: parentRect.width,
            parentStyle: parent.getAttribute('style'),
            computedMaxWidth: computed.maxWidth,
            parentComputedWidth: parentComputed.width,
            viewportWidth: window.innerWidth
          });
        }
      });
      
      return problematic;
    });
    
    console.log('Found problematic images:');
    imageInfo.forEach(info => {
      console.log(`\n📸 ${info.src}:`);
      console.log(`  Image: ${info.imgWidth}x${info.imgHeight}`);
      console.log(`  Image class: "${info.imgClass}"`);
      console.log(`  Image style: ${info.imgStyle}`);
      console.log(`  Computed max-width: ${info.computedMaxWidth}`);
      console.log(`  Parent: <${info.parentTag} class="${info.parentClass}">`);
      console.log(`  Parent width: ${info.parentWidth}`);
      console.log(`  Parent style: ${info.parentStyle}`);
      console.log(`  Viewport: ${info.viewportWidth}`);
    });
    
    // Scroll to find these images
    await page.evaluate(() => {
      const img = document.querySelector('img[src*="5.jpg"]');
      if (img) {
        img.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-image-issue.png', fullPage: false });
    console.log('\n📸 Debug screenshot saved: debug-image-issue.png');
    
    console.log('\nKeeping browser open for 30 seconds for inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();