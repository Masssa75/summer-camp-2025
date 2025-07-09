const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  
  console.log('Verifying deployment fixes...');
  console.log('Time:', new Date().toLocaleTimeString());
  
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  // Clear cache and force reload
  await page.goto('https://phuketsummercamp.com', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // Force reload to bypass cache
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Check if CSS is updated by looking for our specific changes
  const cssUpdated = await page.evaluate(() => {
    const styles = Array.from(document.styleSheets);
    for (const sheet of styles) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        const hasMaxHeight = rules.some(rule => 
          rule.cssText && rule.cssText.includes('max-height: 500px')
        );
        if (hasMaxHeight) return true;
      } catch (e) {}
    }
    return false;
  });
  
  console.log('\nCSS deployment status:', cssUpdated ? '✅ Updated' : '❌ Not updated yet');
  
  // Test the problematic sections
  const tests = [
    { 
      name: 'Slide 3 (Youngest Explorers)', 
      selector: '.slide-3',
      imgSelector: '.slide-3 .single-photo img'
    },
    { 
      name: 'Slide 7 (Cooking)', 
      selector: '.slide-7',
      imgSelector: '.slide-7 .feature-photo img'
    },
    { 
      name: 'Slide 14 (Fosters Creativity)', 
      selector: '.slide-14',
      imgSelector: '.slide-14 .slide-14-photo img'
    }
  ];
  
  for (const test of tests) {
    // Scroll to section
    await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, test.selector);
    
    await page.waitForTimeout(2000);
    
    // Check image
    const imageInfo = await page.evaluate((imgSelector) => {
      const img = document.querySelector(imgSelector);
      if (!img) return null;
      
      const rect = img.getBoundingClientRect();
      const styles = window.getComputedStyle(img);
      
      return {
        found: true,
        naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
        displaySize: `${img.offsetWidth}x${img.offsetHeight}`,
        computedStyles: {
          width: styles.width,
          height: styles.height,
          maxWidth: styles.maxWidth,
          maxHeight: styles.maxHeight
        },
        overflowing: rect.width > window.innerWidth || img.offsetWidth > 700,
        position: {
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        }
      };
    }, test.imgSelector);
    
    console.log(`\n${test.name}:`);
    if (imageInfo && imageInfo.found) {
      console.log(`  Natural: ${imageInfo.naturalSize}`);
      console.log(`  Display: ${imageInfo.displaySize}`);
      console.log(`  Max-height: ${imageInfo.computedStyles.maxHeight}`);
      console.log(`  Status: ${imageInfo.overflowing ? '❌ STILL TOO LARGE' : '✅ Fixed'}`);
      if (imageInfo.overflowing) {
        console.log(`  Position: ${imageInfo.position.width}px wide at x:${imageInfo.position.left}`);
      }
    } else {
      console.log('  ❌ Image not found');
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: `verify-${test.selector.replace('.', '')}.png`, 
      fullPage: false 
    });
  }
  
  await browser.close();
})();