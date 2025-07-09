const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  
  // Test desktop viewport
  console.log('Testing DESKTOP viewport...');
  const desktopPage = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await desktopPage.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(2000);
  
  // Check images on desktop
  const desktopImages = await desktopPage.$$eval('img', imgs => 
    imgs.map(img => ({
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: img.offsetWidth,
      displayHeight: img.offsetHeight,
      alt: img.alt,
      className: img.className,
      parent: img.parentElement.className
    }))
  );
  
  console.log('\nDesktop images found:', desktopImages.length);
  desktopImages.forEach((img, i) => {
    console.log(`\nImage ${i + 1}:`);
    console.log(`  src: ${img.src}`);
    console.log(`  natural size: ${img.naturalWidth}x${img.naturalHeight}`);
    console.log(`  display size: ${img.displayWidth}x${img.displayHeight}`);
    console.log(`  className: ${img.className}`);
    console.log(`  parent: ${img.parent}`);
    if (img.naturalWidth === 0 || img.displayWidth === 0) {
      console.log('  ⚠️  IMAGE NOT LOADING OR NOT VISIBLE!');
    }
  });
  
  await desktopPage.screenshot({ path: 'desktop-view.png', fullPage: true });
  
  // Test mobile viewport
  console.log('\n\nTesting MOBILE viewport...');
  const mobilePage = await browser.newPage({
    viewport: { width: 375, height: 667 }
  });
  
  await mobilePage.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  
  // Check images on mobile
  const mobileImages = await mobilePage.$$eval('img', imgs => 
    imgs.map(img => ({
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: img.offsetWidth,
      displayHeight: img.offsetHeight,
      alt: img.alt,
      className: img.className,
      parent: img.parentElement.className
    }))
  );
  
  console.log('\nMobile images found:', mobileImages.length);
  mobileImages.forEach((img, i) => {
    console.log(`\nImage ${i + 1}:`);
    console.log(`  src: ${img.src}`);
    console.log(`  natural size: ${img.naturalWidth}x${img.naturalHeight}`);
    console.log(`  display size: ${img.displayWidth}x${img.displayHeight}`);
    console.log(`  className: ${img.className}`);
    console.log(`  parent: ${img.parent}`);
    if (img.naturalWidth === 0 || img.displayWidth === 0) {
      console.log('  ⚠️  IMAGE NOT LOADING OR NOT VISIBLE!');
    }
  });
  
  await mobilePage.screenshot({ path: 'mobile-view.png', fullPage: true });
  
  await browser.close();
})();