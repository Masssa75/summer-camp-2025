const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Get all images and their dimensions
    const allImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const viewport = window.innerWidth;
      
      return images.map(img => {
        const rect = img.getBoundingClientRect();
        const isOverflowing = rect.width > viewport || rect.right > viewport;
        
        return {
          src: img.src.split('/').pop(),
          width: Math.round(rect.width),
          right: Math.round(rect.right),
          isOverflowing,
          class: img.className,
          parentClass: img.parentElement?.className || 'no-parent'
        };
      }).filter(img => img.isOverflowing);
    });
    
    console.log(`Found ${allImages.length} overflowing images:\n`);
    allImages.forEach(img => {
      console.log(`${img.src}: ${img.width}px wide, ends at ${img.right}px`);
      console.log(`  Parent: ${img.parentClass}`);
      console.log(`  Class: ${img.class}\n`);
    });
    
    // Try with a different approach - check document width
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const htmlWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    console.log('Width measurements:');
    console.log(`Viewport: ${viewportWidth}px`);
    console.log(`Body: ${bodyWidth}px`);
    console.log(`HTML: ${htmlWidth}px`);
    
    if (bodyWidth > viewportWidth || htmlWidth > viewportWidth) {
      console.log('\n❌ Document is wider than viewport!');
    } else {
      console.log('\n✅ Document fits within viewport');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();