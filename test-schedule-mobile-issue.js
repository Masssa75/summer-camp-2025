const { chromium, devices } = require('playwright');

(async () => {
  console.log('Testing schedule section on mobile for white fade issue...');
  
  const browser = await chromium.launch({ 
    headless: false // Show browser to see the issue
  });
  
  // Test on iPhone 14 Pro
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro']
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to the site
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    console.log('Page loaded successfully');
    
    // Click on Schedule in navigation
    console.log('Clicking on Schedule link...');
    await page.click('text=Schedule');
    
    // Wait for navigation
    await page.waitForTimeout(2000);
    
    // Take screenshot of current state
    await page.screenshot({ 
      path: 'schedule-mobile-issue.png',
      fullPage: false 
    });
    console.log('Screenshot saved as schedule-mobile-issue.png');
    
    // Check for any overlay elements
    console.log('Checking for overlay elements...');
    
    // Look for background overlays
    const overlays = await page.$$('.background-overlay');
    console.log(`Found ${overlays.length} background overlay elements`);
    
    // Check schedule container styles
    const scheduleContainer = await page.$('.schedule-container');
    if (scheduleContainer) {
      const styles = await scheduleContainer.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          background: computed.background,
          backgroundColor: computed.backgroundColor,
          opacity: computed.opacity,
          position: computed.position
        };
      });
      console.log('Schedule container styles:', styles);
    }
    
    // Check schedule grid styles
    const scheduleGrid = await page.$('.schedule-grid');
    if (scheduleGrid) {
      const styles = await scheduleGrid.evaluate(el => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          background: computed.background,
          backgroundColor: computed.backgroundColor,
          borderRadius: computed.borderRadius,
          overflow: computed.overflow,
          position: computed.position,
          dimensions: {
            width: rect.width,
            height: rect.height
          }
        };
      });
      console.log('Schedule grid styles:', styles);
      
      // Check for pseudo elements
      const beforeStyles = await scheduleGrid.evaluate(el => {
        const before = window.getComputedStyle(el, '::before');
        const after = window.getComputedStyle(el, '::after');
        return {
          before: {
            content: before.content,
            background: before.background,
            position: before.position,
            opacity: before.opacity
          },
          after: {
            content: after.content,
            background: after.background,
            position: after.position,
            opacity: after.opacity
          }
        };
      });
      console.log('Pseudo element styles:', beforeStyles);
    }
    
    // Check parent section styles
    const scheduleSection = await page.$('#schedule-section, #mini-schedule-section, .slide-19');
    if (scheduleSection) {
      const styles = await scheduleSection.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          background: computed.background,
          backgroundColor: computed.backgroundColor,
          overflow: computed.overflow
        };
      });
      console.log('Schedule section styles:', styles);
    }
    
    // Check for any gradients or overlays in CSS
    const pageStyles = await page.evaluate(() => {
      const styles = [];
      const sheets = document.styleSheets;
      
      for (let i = 0; i < sheets.length; i++) {
        try {
          const rules = sheets[i].cssRules || sheets[i].rules;
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            if (rule.selectorText && 
                (rule.selectorText.includes('schedule') || 
                 rule.selectorText.includes('slide-19'))) {
              if (rule.style && 
                  (rule.style.background || 
                   rule.style.backgroundImage || 
                   rule.style.backgroundColor)) {
                styles.push({
                  selector: rule.selectorText,
                  background: rule.style.background,
                  backgroundImage: rule.style.backgroundImage,
                  backgroundColor: rule.style.backgroundColor
                });
              }
            }
          }
        } catch (e) {
          // Skip cross-origin stylesheets
        }
      }
      
      return styles;
    });
    
    console.log('Relevant CSS styles:', pageStyles);
    
    console.log('\\nInvestigation complete. Check the screenshot and logs above.');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
  
  // Keep browser open for manual inspection
  console.log('\\nBrowser will remain open for manual inspection...');
  await page.waitForTimeout(30000);
  
  await browser.close();
})();