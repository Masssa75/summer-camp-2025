const { chromium, devices } = require('playwright');

(async () => {
  console.log('Running visual mobile test...');
  
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 12 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
    
    // Add visual debugging overlay
    await page.evaluate(() => {
      // Highlight all images
      document.querySelectorAll('img').forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.width > window.innerWidth - 10) {
          img.style.border = '3px solid red';
          img.style.opacity = '0.8';
        }
      });
      
      // Add viewport indicator
      const indicator = document.createElement('div');
      indicator.style.position = 'fixed';
      indicator.style.top = '50px';
      indicator.style.right = '0';
      indicator.style.width = '2px';
      indicator.style.height = '100%';
      indicator.style.background = 'red';
      indicator.style.zIndex = '9999';
      document.body.appendChild(indicator);
      
      // Add viewport width label
      const label = document.createElement('div');
      label.style.position = 'fixed';
      label.style.top = '10px';
      label.style.right = '10px';
      label.style.background = 'red';
      label.style.color = 'white';
      label.style.padding = '5px 10px';
      label.style.zIndex = '9999';
      label.style.fontFamily = 'monospace';
      label.textContent = `Viewport: ${window.innerWidth}px`;
      document.body.appendChild(label);
    });
    
    // Find and scroll to problem images
    await page.evaluate(() => {
      const problemImage = Array.from(document.querySelectorAll('img')).find(img => 
        img.src.includes('5.jpg') && img.getBoundingClientRect().width > 300
      );
      if (problemImage) {
        problemImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'mobile-visual-debug.png', fullPage: false });
    console.log('📸 Visual debug screenshot saved');
    
    // Check actual vs computed styles
    const imageData = await page.evaluate(() => {
      const img = document.querySelector('img[src*="5.jpg"]');
      if (!img) return null;
      
      const computed = window.getComputedStyle(img);
      const rect = img.getBoundingClientRect();
      const parent = img.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const parentComputed = window.getComputedStyle(parent);
      
      return {
        img: {
          width: rect.width,
          maxWidth: computed.maxWidth,
          style: img.getAttribute('style'),
          class: img.className
        },
        parent: {
          tag: parent.tagName,
          class: parent.className,
          width: parentRect.width,
          maxWidth: parentComputed.maxWidth,
          padding: parentComputed.padding
        },
        viewport: window.innerWidth
      };
    });
    
    console.log('\nImage analysis:', JSON.stringify(imageData, null, 2));
    
    console.log('\nKeeping browser open for manual inspection...');
    await page.waitForTimeout(60000);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();