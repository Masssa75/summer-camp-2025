const { chromium } = require('playwright');
const path = require('path');

async function checkCurrentLayout() {
  console.log('Opening browser to check current layout...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.join(__dirname, 'mockups/hotel-brochure-trifold-complete.html');
  await page.goto(filePath);
  await page.waitForTimeout(2000);
  
  // Check if our new containers exist
  const leftContainer = await page.$('.left-container');
  const rightContainer = await page.$('.right-container');
  const bottomSection = await page.$('.panel.cover .bottom-section');
  
  console.log('Left container exists:', !!leftContainer);
  console.log('Right container exists:', !!rightContainer);
  console.log('Bottom section exists:', !!bottomSection);
  
  if (bottomSection) {
    // Highlight containers
    await page.evaluate(() => {
      const left = document.querySelector('.left-container');
      const right = document.querySelector('.right-container');
      const bottom = document.querySelector('.panel.cover .bottom-section');
      
      if (left) {
        left.style.border = '2px solid yellow';
        left.style.backgroundColor = 'rgba(255,255,0,0.1)';
      }
      if (right) {
        right.style.border = '2px solid red';
        right.style.backgroundColor = 'rgba(255,0,0,0.1)';
      }
      if (bottom) {
        bottom.style.outline = '3px solid green';
      }
    });
    
    // Get HTML structure
    const html = await bottomSection.innerHTML();
    console.log('\nBottom section HTML:');
    console.log(html);
  }
  
  await page.screenshot({ path: 'current-layout-check.png', fullPage: true });
  console.log('\nScreenshot saved as current-layout-check.png');
  console.log('Yellow = left container, Red = right container, Green = bottom section');
  
  console.log('\nBrowser open for 30 seconds for inspection...');
  await page.waitForTimeout(30000);
  
  await browser.close();
}

checkCurrentLayout();