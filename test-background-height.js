const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing background image height issue...');
  
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Analyze the slide and background structure
    const backgroundInfo = await page.evaluate(() => {
      const slide1 = document.querySelector('.slide-1');
      const bgLayer = document.querySelector('.slide-1 .background-layer');
      const bgImg = document.querySelector('.slide-1 .background-layer img');
      const contentWrapper = document.querySelector('.slide-1 .content-wrapper');
      
      const slideRect = slide1?.getBoundingClientRect();
      const slideComputed = slide1 ? window.getComputedStyle(slide1) : null;
      
      const bgLayerRect = bgLayer?.getBoundingClientRect();
      const bgLayerComputed = bgLayer ? window.getComputedStyle(bgLayer) : null;
      
      const bgImgRect = bgImg?.getBoundingClientRect();
      const bgImgComputed = bgImg ? window.getComputedStyle(bgImg) : null;
      
      return {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        slide: {
          height: slideRect?.height,
          minHeight: slideComputed?.minHeight,
          position: slideComputed?.position
        },
        backgroundLayer: {
          height: bgLayerRect?.height,
          position: bgLayerComputed?.position,
          top: bgLayerComputed?.top,
          bottom: bgLayerComputed?.bottom,
          inset: bgLayerComputed?.inset
        },
        backgroundImg: {
          height: bgImgRect?.height,
          width: bgImgRect?.width,
          objectFit: bgImgComputed?.objectFit,
          maxWidth: bgImgComputed?.maxWidth,
          maxHeight: bgImgComputed?.maxHeight
        }
      };
    });
    
    console.log('Background analysis:', JSON.stringify(backgroundInfo, null, 2));
    
    // Check specific CSS rules
    const cssRules = await page.evaluate(() => {
      const rules = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText && 
                (rule.selectorText.includes('.background-layer') || 
                 rule.selectorText.includes('.slide-1'))) {
              rules.push({
                selector: rule.selectorText,
                styles: rule.style.cssText
              });
            }
          }
        } catch (e) {}
      }
      return rules;
    });
    
    console.log('\nRelevant CSS rules:');
    cssRules.forEach(rule => {
      if (rule.styles.includes('height') || rule.styles.includes('inset')) {
        console.log(`${rule.selector}: ${rule.styles.substring(0, 100)}...`);
      }
    });
    
    await page.screenshot({ path: 'background-height-issue.png', fullPage: false });
    console.log('\n📸 Screenshot saved');
    
    console.log('Keeping browser open for inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();