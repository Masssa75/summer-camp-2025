const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Go to the site
  await page.goto('https://warm-hamster-50f715.netlify.app');
  
  // Wait for schedule to load
  await page.waitForSelector('.schedule-grid', { timeout: 10000 });
  
  // Get the schedule structure
  const scheduleStructure = await page.evaluate(() => {
    const grid = document.querySelector('.schedule-grid');
    if (!grid) return 'No schedule grid found';
    
    const timeColumn = grid.querySelector('.time-column');
    const dayColumns = grid.querySelectorAll('.day-column');
    
    return {
      timeColumnHTML: timeColumn ? timeColumn.innerHTML : 'No time column',
      timeColumnText: timeColumn ? timeColumn.textContent : 'No time column',
      dayColumnsCount: dayColumns.length,
      firstDayColumnHTML: dayColumns[0] ? dayColumns[0].innerHTML : 'No day columns',
      gridClasses: grid.className,
      computedDisplay: window.getComputedStyle(grid).display,
      computedFlexDirection: window.getComputedStyle(timeColumn).flexDirection
    };
  });
  
  console.log('Schedule Structure:', JSON.stringify(scheduleStructure, null, 2));
  
  // Take a screenshot
  await page.screenshot({ path: 'schedule-debug.png', fullPage: false });
  
  await browser.close();
})();