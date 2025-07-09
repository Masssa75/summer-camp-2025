const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  
  console.log('Testing final image fixes...');
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  // Force fresh load
  await page.goto('https://phuketsummercamp.com', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  await page.waitForTimeout(3000);
  
  // Test slide 14
  await page.evaluate(() => {
    const slide14 = document.querySelector('.slide-14');
    if (slide14) {
      slide14.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  
  await page.waitForTimeout(2000);
  
  const slide14Fixed = await page.evaluate(() => {
    const img = document.querySelector('.slide-14 .slide-14-photo img');
    if (img) {
      return {
        naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
        displaySize: `${img.offsetWidth}x${img.offsetHeight}`,
        computedWidth: window.getComputedStyle(img).width,
        computedMaxHeight: window.getComputedStyle(img).maxHeight,
        overflowing: img.offsetWidth > window.innerWidth
      };
    }
    return null;
  });
  
  console.log('\nSlide 14 (Fosters Creativity):');
  if (slide14Fixed) {
    console.log('  Natural size:', slide14Fixed.naturalSize);
    console.log('  Display size:', slide14Fixed.displaySize);
    console.log('  Max height:', slide14Fixed.computedMaxHeight);
    console.log('  Overflowing:', slide14Fixed.overflowing ? '❌ YES' : '✅ NO');
  }
  
  // Test cooking section
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const cookingHeading = headings.find(h => h.textContent.includes('Cooking'));
    if (cookingHeading) {
      cookingHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  
  await page.waitForTimeout(2000);
  
  const cookingFixed = await page.evaluate(() => {
    const img = document.querySelector('.slide-7 img:not(.background-layer img)');
    if (img) {
      return {
        naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
        displaySize: `${img.offsetWidth}x${img.offsetHeight}`,
        computedWidth: window.getComputedStyle(img).width,
        computedHeight: window.getComputedStyle(img).height,
        overflowing: img.offsetWidth > window.innerWidth
      };
    }
    return null;
  });
  
  console.log('\nCooking Section:');
  if (cookingFixed) {
    console.log('  Natural size:', cookingFixed.naturalSize);
    console.log('  Display size:', cookingFixed.displaySize);
    console.log('  Computed size:', `${cookingFixed.computedWidth} x ${cookingFixed.computedHeight}`);
    console.log('  Overflowing:', cookingFixed.overflowing ? '❌ YES' : '✅ NO');
  }
  
  // Check all images for any that are still oversized
  const oversizedImages = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('.content-wrapper img:not(.background-layer img)'));
    
    return images.filter(img => img.offsetWidth > 600).map(img => ({
      src: img.src.split('/').pop(),
      displaySize: `${img.offsetWidth}x${img.offsetHeight}`,
      parent: img.parentElement.className,
      slide: img.closest('.slide')?.className || 'unknown'
    }));
  });
  
  if (oversizedImages.length > 0) {
    console.log('\n❌ Still found oversized images:');
    oversizedImages.forEach(img => {
      console.log(`  ${img.src}: ${img.displaySize} in ${img.slide}`);
    });
  } else {
    console.log('\n✅ All images properly constrained!');
  }
  
  await page.screenshot({ path: 'final-fix-test.png', fullPage: false });
  
  await browser.close();
})();