const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing mobile layout issues...');
  
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Check body padding-top
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return {
        paddingTop: computed.paddingTop,
        marginTop: computed.marginTop,
        position: computed.position
      };
    });
    
    console.log('Body styles:', bodyStyles);
    
    // Check navigation position and styles
    const navInfo = await page.evaluate(() => {
      const nav = document.querySelector('.top-navigation');
      if (!nav) return null;
      
      const rect = nav.getBoundingClientRect();
      const computed = window.getComputedStyle(nav);
      
      return {
        top: rect.top,
        height: rect.height,
        position: computed.position,
        paddingTop: computed.paddingTop,
        marginTop: computed.marginTop
      };
    });
    
    console.log('Navigation info:', navInfo);
    
    // Check first slide/hero section
    const heroInfo = await page.evaluate(() => {
      const slide = document.querySelector('.slide-1');
      const backgroundLayer = document.querySelector('.slide-1 .background-layer');
      const backgroundImg = document.querySelector('.slide-1 .background-layer img');
      
      const slideRect = slide?.getBoundingClientRect();
      const slideComputed = slide ? window.getComputedStyle(slide) : null;
      const bgComputed = backgroundImg ? window.getComputedStyle(backgroundImg) : null;
      
      return {
        slide: {
          top: slideRect?.top,
          height: slideRect?.height,
          minHeight: slideComputed?.minHeight,
          paddingTop: slideComputed?.paddingTop
        },
        backgroundImg: {
          width: bgComputed?.width,
          height: bgComputed?.height,
          maxWidth: bgComputed?.maxWidth,
          objectFit: bgComputed?.objectFit
        }
      };
    });
    
    console.log('Hero section info:', JSON.stringify(heroInfo, null, 2));
    
    // Check for any elements causing the white space
    const elementsAtTop = await page.evaluate(() => {
      const elements = document.elementsFromPoint(200, 50); // Check what's at the top
      return elements.map(el => ({
        tag: el.tagName,
        class: el.className,
        id: el.id,
        height: el.getBoundingClientRect().height
      }));
    });
    
    console.log('\nElements at top of page:', elementsAtTop);
    
    // Check all applied media queries
    const mediaQueries = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets);
      const mediaRules = [];
      
      styles.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          rules.forEach(rule => {
            if (rule.type === CSSRule.MEDIA_RULE && rule.conditionText.includes('max-width: 768px')) {
              mediaRules.push({
                media: rule.conditionText,
                rulesCount: rule.cssRules.length
              });
            }
          });
        } catch (e) {}
      });
      
      return mediaRules;
    });
    
    console.log('\nActive media queries:', mediaQueries);
    
    // Take screenshots
    await page.screenshot({ path: 'mobile-layout-full.png', fullPage: true });
    await page.screenshot({ path: 'mobile-layout-viewport.png', fullPage: false });
    
    console.log('\nScreenshots saved');
    console.log('Keeping browser open for inspection...');
    
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();