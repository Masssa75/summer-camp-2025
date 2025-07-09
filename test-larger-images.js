const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  
  // Test desktop viewport
  console.log('Testing DESKTOP with larger images...');
  const desktopPage = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await desktopPage.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(2000);
  
  // Scroll to find carousel section
  await desktopPage.evaluate(() => {
    const carousel = document.querySelector('.photo-carousel');
    if (carousel) {
      carousel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  await desktopPage.waitForTimeout(1000);
  
  // Check story card sizes
  const storyCards = await desktopPage.$$eval('.story-card', cards => 
    cards.slice(0, 3).map(card => ({
      width: card.offsetWidth,
      height: card.offsetHeight,
      className: card.className
    }))
  );
  
  console.log('\nDesktop Story Cards:');
  storyCards.forEach((card, i) => {
    console.log(`Card ${i + 1}: ${card.width}x${card.height}px`);
  });
  
  await desktopPage.screenshot({ path: 'desktop-larger-images.png', fullPage: false });
  
  // Test mobile viewport
  console.log('\n\nTesting MOBILE viewport...');
  const mobilePage = await browser.newPage({
    viewport: { width: 375, height: 667 }
  });
  
  await mobilePage.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  
  // Scroll to carousel
  await mobilePage.evaluate(() => {
    const carousel = document.querySelector('.photo-carousel');
    if (carousel) {
      carousel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  await mobilePage.waitForTimeout(1000);
  
  // Check mobile story card sizes
  const mobileCards = await mobilePage.$$eval('.story-card', cards => 
    cards.slice(0, 3).map(card => ({
      width: card.offsetWidth,
      height: card.offsetHeight,
      viewportWidth: window.innerWidth
    }))
  );
  
  console.log('\nMobile Story Cards:');
  mobileCards.forEach((card, i) => {
    console.log(`Card ${i + 1}: ${card.width}x${card.height}px (viewport: ${card.viewportWidth}px)`);
    console.log(`  ${card.width <= card.viewportWidth ? '✅ Fits in viewport' : '❌ Too wide!'}`);
  });
  
  await mobilePage.screenshot({ path: 'mobile-larger-images.png', fullPage: false });
  
  await browser.close();
})();