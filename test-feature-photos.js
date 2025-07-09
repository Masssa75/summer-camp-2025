const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  
  console.log('Testing feature photos on desktop...');
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Find and scroll to cooking section
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const cookingHeading = headings.find(h => h.textContent.includes('Cooking'));
    if (cookingHeading) {
      cookingHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Check split layout sections
  const splitLayouts = await page.$$eval('.split-layout', layouts => 
    layouts.map(layout => {
      const textPanel = layout.querySelector('.text-panel');
      const featurePhoto = layout.querySelector('.feature-photo');
      const storyCard = layout.querySelector('.story-card');
      
      return {
        hasTextPanel: !!textPanel,
        textPanelWidth: textPanel ? textPanel.offsetWidth : 0,
        hasFeaturePhoto: !!featurePhoto,
        featurePhotoWidth: featurePhoto ? featurePhoto.offsetWidth : 0,
        storyCardSize: storyCard ? `${storyCard.offsetWidth}x${storyCard.offsetHeight}` : 'none',
        layoutWidth: layout.offsetWidth,
        overflowing: layout.scrollWidth > layout.offsetWidth
      };
    })
  );
  
  console.log('\nSplit layouts found:', splitLayouts.length);
  splitLayouts.forEach((layout, i) => {
    console.log(`\nLayout ${i + 1}:`);
    console.log(`  Total width: ${layout.layoutWidth}px`);
    console.log(`  Text panel width: ${layout.textPanelWidth}px`);
    console.log(`  Feature photo width: ${layout.featurePhotoWidth}px`);
    console.log(`  Story card size: ${layout.storyCardSize}`);
    console.log(`  Overflowing: ${layout.overflowing ? '❌ YES' : '✅ NO'}`);
  });
  
  await page.screenshot({ path: 'desktop-feature-photos.png', fullPage: false });
  
  await browser.close();
})();