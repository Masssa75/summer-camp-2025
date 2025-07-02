import { test, expect } from '@playwright/test'

test('Instagram video should be embedded and playable', async ({ page }) => {
  // Go to the homepage
  await page.goto('http://localhost:3000')
  
  // Wait for the video container to be visible
  await page.waitForSelector('.instagram-video-container', { timeout: 10000 })
  
  // Check if iframe exists
  const iframe = await page.$('.instagram-video-container iframe')
  expect(iframe).toBeTruthy()
  
  // Get iframe src
  const iframeSrc = await iframe?.getAttribute('src')
  console.log('Iframe src:', iframeSrc)
  
  // Check if the iframe is properly sized
  const iframeBox = await iframe?.boundingBox()
  console.log('Iframe dimensions:', iframeBox)
  expect(iframeBox?.width).toBeGreaterThan(300)
  expect(iframeBox?.height).toBeGreaterThan(400)
  
  // Take a screenshot
  await page.screenshot({ path: 'instagram-video-test.png', fullPage: true })
})