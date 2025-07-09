const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  
  console.log('Testing cooking section specifically...');
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Find the cooking section by searching for the heading
  const cookingSection = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const cookingHeading = headings.find(h => h.textContent.includes('Joyful Cooking'));
    
    if (cookingHeading) {
      // Get the parent slide section
      let slideSection = cookingHeading.closest('.slide');
      cookingHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Get detailed info about the cooking section
      const splitLayout = slideSection.querySelector('.split-layout');
      const textPanel = slideSection.querySelector('.text-panel');
      const featurePhoto = slideSection.querySelector('.feature-photo');
      const storyCard = slideSection.querySelector('.story-card');
      const cardImage = slideSection.querySelector('.card-image');
      const img = slideSection.querySelector('.story-card img');
      
      return {
        found: true,
        slideClass: slideSection.className,
        splitLayoutWidth: splitLayout ? splitLayout.offsetWidth : 0,
        textPanelWidth: textPanel ? textPanel.offsetWidth : 0,
        featurePhotoWidth: featurePhoto ? featurePhoto.offsetWidth : 0,
        storyCardSize: storyCard ? {
          width: storyCard.offsetWidth,
          height: storyCard.offsetHeight,
          className: storyCard.className
        } : null,
        cardImageSize: cardImage ? {
          width: cardImage.offsetWidth,
          height: cardImage.offsetHeight
        } : null,
        imgSize: img ? {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.offsetWidth,
          displayHeight: img.offsetHeight,
          src: img.src
        } : null,
        viewportWidth: window.innerWidth
      };
    }
    return { found: false };
  });
  
  await page.waitForTimeout(2000);
  
  console.log('\nCooking Section Analysis:');
  if (cookingSection.found) {
    console.log('  Slide class:', cookingSection.slideClass);
    console.log('  Viewport width:', cookingSection.viewportWidth);
    console.log('  Split layout width:', cookingSection.splitLayoutWidth);
    console.log('  Text panel width:', cookingSection.textPanelWidth);
    console.log('  Feature photo width:', cookingSection.featurePhotoWidth);
    
    if (cookingSection.storyCardSize) {
      console.log('\n  Story card:');
      console.log('    Size:', cookingSection.storyCardSize.width + 'x' + cookingSection.storyCardSize.height);
      console.log('    Classes:', cookingSection.storyCardSize.className);
    }
    
    if (cookingSection.cardImageSize) {
      console.log('\n  Card image container:');
      console.log('    Size:', cookingSection.cardImageSize.width + 'x' + cookingSection.cardImageSize.height);
    }
    
    if (cookingSection.imgSize) {
      console.log('\n  Actual image:');
      console.log('    Natural size:', cookingSection.imgSize.naturalWidth + 'x' + cookingSection.imgSize.naturalHeight);
      console.log('    Display size:', cookingSection.imgSize.displayWidth + 'x' + cookingSection.imgSize.displayHeight);
      console.log('    Image file:', cookingSection.imgSize.src.split('/').pop());
      
      if (cookingSection.imgSize.displayWidth === cookingSection.imgSize.naturalWidth) {
        console.log('    ❌ IMAGE DISPLAYING AT FULL NATURAL SIZE!');
      } else {
        console.log('    ✅ Image properly constrained');
      }
    }
  } else {
    console.log('  ❌ Cooking section not found!');
  }
  
  // Take a screenshot of the current view
  await page.screenshot({ path: 'cooking-section-debug.png', fullPage: false });
  
  // Also check CSS rules applied
  const cssRules = await page.evaluate(() => {
    const img = document.querySelector('.slide-7 .story-card img');
    if (img) {
      const computed = window.getComputedStyle(img);
      return {
        width: computed.width,
        height: computed.height,
        maxWidth: computed.maxWidth,
        maxHeight: computed.maxHeight,
        objectFit: computed.objectFit
      };
    }
    return null;
  });
  
  if (cssRules) {
    console.log('\n  Computed CSS for image:');
    console.log('    width:', cssRules.width);
    console.log('    height:', cssRules.height);
    console.log('    max-width:', cssRules.maxWidth);
    console.log('    max-height:', cssRules.maxHeight);
    console.log('    object-fit:', cssRules.objectFit);
  }
  
  await browser.close();
})();