const { chromium } = require('playwright');

(async () => {
  // Launch with cache disabled
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-application-cache', '--disable-cache']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    bypassCSP: true,
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  
  // Clear any service workers or cache
  await page.goto('https://phuketsummercamp.com');
  await page.evaluate(() => {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
  });
  
  // Force reload with cache bypass
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  console.log('Checking deployment status...');
  
  // Check if the CSS changes are actually deployed
  const cssContent = await page.evaluate(async () => {
    const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    for (const link of cssLinks) {
      if (link.href.includes('carousel-brochure')) {
        try {
          const response = await fetch(link.href);
          const text = await response.text();
          
          // Check for our recent changes
          const hasFeaturePhotoFix = text.includes('.feature-photo .story-card {') && 
                                    text.includes('max-width: 400px');
          const hasSplitLayoutFix = text.includes('.split-layout .feature-photo {');
          
          return {
            url: link.href,
            hasFeaturePhotoFix,
            hasSplitLayoutFix,
            cssLength: text.length
          };
        } catch (e) {
          return { error: e.message };
        }
      }
    }
    return null;
  });
  
  console.log('\nCSS deployment check:');
  if (cssContent) {
    console.log('  CSS URL:', cssContent.url);
    console.log('  Has feature photo fix:', cssContent.hasFeaturePhotoFix ? '✅' : '❌');
    console.log('  Has split layout fix:', cssContent.hasSplitLayoutFix ? '✅' : '❌');
    console.log('  CSS file size:', cssContent.cssLength, 'bytes');
  }
  
  // Now scroll to cooking section
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const cookingHeading = headings.find(h => h.textContent.includes('Joyful Cooking'));
    if (cookingHeading) {
      cookingHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Check what CSS rules are actually applied to feature-photo
  const appliedStyles = await page.evaluate(() => {
    const featurePhoto = document.querySelector('.slide-7 .feature-photo');
    const storyCard = document.querySelector('.slide-7 .feature-photo .story-card');
    
    if (featurePhoto && storyCard) {
      const fpComputed = window.getComputedStyle(featurePhoto);
      const scComputed = window.getComputedStyle(storyCard);
      
      return {
        featurePhoto: {
          maxWidth: fpComputed.maxWidth,
          width: fpComputed.width,
          flex: fpComputed.flex,
          overflow: fpComputed.overflow
        },
        storyCard: {
          width: scComputed.width,
          height: scComputed.height,
          minWidth: scComputed.minWidth,
          maxWidth: scComputed.maxWidth
        }
      };
    }
    return null;
  });
  
  console.log('\nApplied styles:');
  if (appliedStyles) {
    console.log('  Feature photo container:');
    Object.entries(appliedStyles.featurePhoto).forEach(([key, value]) => {
      console.log(`    ${key}: ${value}`);
    });
    console.log('  Story card:');
    Object.entries(appliedStyles.storyCard).forEach(([key, value]) => {
      console.log(`    ${key}: ${value}`);
    });
  }
  
  await page.screenshot({ path: 'cooking-section-nocache.png', fullPage: false });
  
  await browser.close();
})();