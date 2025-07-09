const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  console.log('Checking ALL sections with images...\n');
  
  // Get all sections with split layouts
  const sections = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    
    return slides.map((slide, index) => {
      const splitLayout = slide.querySelector('.split-layout');
      const img = slide.querySelector('img:not(.background-layer img)');
      const heading = slide.querySelector('h2');
      
      if (splitLayout && img) {
        const imgRect = img.getBoundingClientRect();
        const slideRect = slide.getBoundingClientRect();
        
        return {
          slideNumber: index + 1,
          slideClass: slide.className,
          heading: heading ? heading.textContent.trim() : 'No heading',
          imageInfo: {
            src: img.src.split('/').pop(),
            naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
            displaySize: `${img.offsetWidth}x${img.offsetHeight}`,
            visibleInViewport: imgRect.top < window.innerHeight && imgRect.bottom > 0,
            overflowingViewport: imgRect.width > window.innerWidth,
            position: {
              top: imgRect.top,
              left: imgRect.left,
              right: imgRect.right,
              bottom: imgRect.bottom
            }
          },
          slideVisible: slideRect.top < window.innerHeight && slideRect.bottom > 0
        };
      }
      return null;
    }).filter(Boolean);
  });
  
  sections.forEach(section => {
    console.log(`Slide ${section.slideNumber} (${section.slideClass}):`);
    console.log(`  Heading: ${section.heading}`);
    console.log(`  Image: ${section.imageInfo.src}`);
    console.log(`  Natural size: ${section.imageInfo.naturalSize}`);
    console.log(`  Display size: ${section.imageInfo.displaySize}`);
    console.log(`  Visible now: ${section.imageInfo.visibleInViewport ? 'Yes' : 'No'}`);
    console.log(`  Overflowing: ${section.imageInfo.overflowingViewport ? '❌ YES' : '✅ NO'}`);
    console.log(`  Position: L:${Math.round(section.imageInfo.position.left)}, R:${Math.round(section.imageInfo.position.right)}`);
    console.log('');
  });
  
  // Find any images that might be overflowing
  const overflowingImages = sections.filter(s => s.imageInfo.overflowingViewport);
  
  if (overflowingImages.length > 0) {
    console.log('\n❌ FOUND OVERFLOWING IMAGES:');
    for (const section of overflowingImages) {
      console.log(`\nNavigating to: ${section.heading}`);
      
      // Scroll to this section
      await page.evaluate((slideClass) => {
        const slide = document.querySelector(`.${slideClass.split(' ').join('.')}`);
        if (slide) {
          slide.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, section.slideClass);
      
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `overflow-${section.slideNumber}.png`, fullPage: false });
    }
  } else {
    console.log('\n✅ No overflowing images found!');
  }
  
  await browser.close();
})();