const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  
  // Test desktop viewport
  console.log('Testing DESKTOP viewport after fixes...');
  const desktopPage = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await desktopPage.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(2000);
  
  // Check specific problematic images
  const checkImages = [
    '.story-card img',
    '.activity-bubble img',
    '.slide-14-photo img',
    '.card-image img'
  ];
  
  for (const selector of checkImages) {
    const images = await desktopPage.$$(selector);
    if (images.length > 0) {
      const imgInfo = await images[0].evaluate(img => ({
        selector: img.className || 'no-class',
        naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
        displaySize: `${img.offsetWidth}x${img.offsetHeight}`,
        src: img.src.split('/').pop()
      }));
      console.log(`\n${selector}:`);
      console.log(`  Image: ${imgInfo.src}`);
      console.log(`  Natural: ${imgInfo.naturalSize}`);
      console.log(`  Display: ${imgInfo.displaySize}`);
      console.log(`  ${imgInfo.displaySize === imgInfo.naturalSize ? '❌ SHOWING AT FULL SIZE!' : '✅ Properly constrained'}`);
    }
  }
  
  await desktopPage.screenshot({ path: 'desktop-fixed.png', fullPage: false });
  
  // Test mobile viewport
  console.log('\n\nTesting MOBILE viewport after fixes...');
  const mobilePage = await browser.newPage({
    viewport: { width: 375, height: 667 }
  });
  
  await mobilePage.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  
  // Check if images still work on mobile
  const mobileImages = await mobilePage.$$('.story-card img, .activity-bubble img');
  console.log(`\nFound ${mobileImages.length} images on mobile`);
  
  if (mobileImages.length > 0) {
    const firstImg = await mobileImages[0].evaluate(img => ({
      displaySize: `${img.offsetWidth}x${img.offsetHeight}`,
      viewportWidth: window.innerWidth
    }));
    console.log(`First image display size: ${firstImg.displaySize}`);
    console.log(`Viewport width: ${firstImg.viewportWidth}`);
    console.log(`${parseInt(firstImg.displaySize.split('x')[0]) <= firstImg.viewportWidth ? '✅ Mobile images properly contained' : '❌ Mobile images overflowing'}`);
  }
  
  await mobilePage.screenshot({ path: 'mobile-fixed.png', fullPage: false });
  
  await browser.close();
})();