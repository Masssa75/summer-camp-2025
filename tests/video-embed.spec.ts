import { test, expect } from '@playwright/test'

test.describe('Video Embed Tests', () => {
  test('should display video thumbnail with play button', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for video embed container
    await page.waitForSelector('.video-embed-container')
    
    // Check if thumbnail is visible
    const thumbnail = await page.$('.video-thumbnail')
    expect(thumbnail).toBeTruthy()
    
    // Check if play button is visible
    const playButton = await page.$('.play-button')
    expect(playButton).toBeTruthy()
    
    // Check if play text is visible
    const playText = await page.textContent('.play-text')
    expect(playText).toBe('Watch Campus Tour')
    
    // Take screenshot before interaction
    await page.screenshot({ path: 'video-before-click.png' })
    
    // Click the play button
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('.video-thumbnail')
    ])
    
    // Verify new tab opened with Instagram URL
    expect(newPage.url()).toContain('instagram.com')
    
    await newPage.close()
  })
  
  test('should have proper styling', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Check container dimensions
    const container = await page.$('.video-embed-container')
    const box = await container?.boundingBox()
    
    expect(box?.width).toBeLessThanOrEqual(400)
    expect(box?.height).toBeGreaterThan(400)
    
    // Check if caption is visible
    const caption = await page.textContent('.video-caption')
    expect(caption).toBe('Take a journey through our beautiful campus')
  })
})