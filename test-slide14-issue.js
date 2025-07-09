const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  
  console.log('Testing slide-14 image issue...');
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Scroll to slide 14
  await page.evaluate(() => {
    const slide14 = document.querySelector('.slide-14');
    if (slide14) {
      slide14.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Check slide 14 specifically
  const slide14Info = await page.evaluate(() => {
    const slide = document.querySelector('.slide-14');
    if (!slide) return null;
    
    const photo = slide.querySelector('.slide-14-photo');
    const img = slide.querySelector('.slide-14-photo img');
    
    if (photo && img) {
      const imgRect = img.getBoundingClientRect();
      const photoRect = photo.getBoundingClientRect();
      
      // Get all styles
      const imgStyles = window.getComputedStyle(img);
      const inlineStyles = img.getAttribute('style');
      
      return {
        photoContainer: {
          width: photo.offsetWidth,
          height: photo.offsetHeight,
          className: photo.className
        },
        image: {
          naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
          displaySize: `${img.offsetWidth}x${img.offsetHeight}`,
          src: img.src.split('/').pop(),
          className: img.className,
          inlineStyles: inlineStyles,
          computedStyles: {
            width: imgStyles.width,
            height: imgStyles.height,
            maxWidth: imgStyles.maxWidth,
            maxHeight: imgStyles.maxHeight,
            objectFit: imgStyles.objectFit
          },
          overflowing: imgRect.width > window.innerWidth,
          position: {
            left: imgRect.left,
            right: imgRect.right,
            width: imgRect.width
          }
        }
      };
    }
    return null;
  });
  
  console.log('\nSlide 14 Analysis:');
  if (slide14Info) {
    console.log('Photo container:');
    console.log('  Width:', slide14Info.photoContainer.width);
    console.log('  Class:', slide14Info.photoContainer.className);
    
    console.log('\nImage:');
    console.log('  Natural size:', slide14Info.image.naturalSize);
    console.log('  Display size:', slide14Info.image.displaySize);
    console.log('  Source:', slide14Info.image.src);
    console.log('  Class:', slide14Info.image.className);
    console.log('  Inline styles:', slide14Info.image.inlineStyles);
    console.log('  Computed width:', slide14Info.image.computedStyles.width);
    console.log('  Computed max-width:', slide14Info.image.computedStyles.maxWidth);
    console.log('  Overflowing:', slide14Info.image.overflowing ? '❌ YES' : '✅ NO');
    console.log('  Position: L:', slide14Info.image.position.left, 'R:', slide14Info.image.position.right);
  }
  
  await page.screenshot({ path: 'slide14-debug.png', fullPage: false });
  
  // Also check for any other GlobalGalleryImage instances that might be problematic
  const allGlobalImages = await page.evaluate(() => {
    // Find all images that might be using GlobalGalleryImage (have cursor-pointer and transition classes)
    const images = Array.from(document.querySelectorAll('img.cursor-pointer.transition-transform'));
    
    return images.filter(img => {
      // Skip background images
      if (img.closest('.background-layer')) return false;
      
      // Check if it's oversized
      return img.offsetWidth > 600 || img.naturalWidth === img.offsetWidth;
    }).map(img => ({
      src: img.src.split('/').pop(),
      naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
      displaySize: `${img.offsetWidth}x${img.offsetHeight}`,
      parent: img.parentElement.className,
      slideClass: img.closest('.slide')?.className || 'unknown'
    }));
  });
  
  if (allGlobalImages.length > 0) {
    console.log('\n\n❌ Found oversized GlobalGalleryImage instances:');
    allGlobalImages.forEach((img, i) => {
      console.log(`\n${i + 1}. ${img.src}`);
      console.log(`   Natural: ${img.naturalSize}`);
      console.log(`   Display: ${img.displaySize}`);
      console.log(`   Parent: ${img.parent}`);
      console.log(`   Slide: ${img.slideClass}`);
    });
  }
  
  await browser.close();
})();