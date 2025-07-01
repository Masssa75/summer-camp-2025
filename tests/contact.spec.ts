import { test, expect } from '@playwright/test';

test('contact page layout', async ({ page }) => {
  await page.goto('https://summer-camp-2025.netlify.app/');
  
  // Scroll to contact section
  await page.evaluate(() => {
    document.querySelector('#contact-section')?.scrollIntoView({ behavior: 'smooth' });
  });
  
  await page.waitForTimeout(2000);
  
  // Take screenshot of contact section
  await page.screenshot({ 
    path: 'contact-page-redesign.png',
    fullPage: false,
    clip: {
      x: 0,
      y: await page.evaluate(() => document.querySelector('#contact-section')?.getBoundingClientRect().top || 0),
      width: 1280,
      height: 800
    }
  });
});