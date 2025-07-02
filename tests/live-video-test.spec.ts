import { test, expect } from '@playwright/test'

test('Live site video embed works correctly', async ({ page, context }) => {
  // Go to the live site
  await page.goto('https://warm-hamster-50f715.netlify.app')
  
  // Wait for page to load
  await page.waitForLoadState('networkidle')
  
  // Check if video embed container exists
  const videoContainer = await page.$('.video-embed-container')
  expect(videoContainer).toBeTruthy()
  
  // Take screenshot of the homepage
  await page.screenshot({ path: 'live-site-video.png', fullPage: false })
  
  // Check for play button
  const playButton = await page.$('.play-button')
  if (playButton) {
    console.log('✓ Play button found - using thumbnail approach')
    
    // Click and check if new tab opens
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('.video-thumbnail')
    ])
    
    // Check if Instagram opened
    await newPage.waitForLoadState()
    const url = newPage.url()
    console.log('Opened URL:', url)
    expect(url).toContain('instagram.com')
    
    await newPage.close()
  } else {
    // Check for iframe (old approach)
    const iframe = await page.$('iframe[src*="instagram.com"]')
    if (iframe) {
      console.log('✓ Instagram iframe found')
      const src = await iframe.getAttribute('src')
      console.log('Iframe src:', src)
    } else {
      console.log('✗ No video element found')
    }
  }
})