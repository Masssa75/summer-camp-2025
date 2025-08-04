const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Use headed mode to see what happens
  const page = await browser.newPage();
  
  console.log('Testing teacher recruitment routing issue...');
  
  try {
    // First try direct navigation to teacher recruitment
    console.log('\n1. Testing direct navigation to /admin/teacher-recruitment...');
    await page.goto('https://phuketsummercamp.com/admin/teacher-recruitment', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    let currentUrl = page.url();
    console.log('   Current URL after direct navigation:', currentUrl);
    
    // Check if we were redirected
    if (currentUrl.includes('/admin') && !currentUrl.includes('teacher-recruitment')) {
      console.log('   ❌ ISSUE: Redirected to /admin instead of staying on teacher-recruitment');
    }
    
    // Now try logging in first
    console.log('\n2. Testing with authentication...');
    await page.goto('https://phuketsummercamp.com/test-auth', { waitUntil: 'networkidle' });
    await page.fill('input[type="password"]', 'test123');
    await page.click('button:has-text("Login")');
    await page.waitForURL('**/admin', { timeout: 10000 });
    console.log('   ✓ Logged in successfully');
    
    // Try navigating to teacher recruitment after login
    console.log('\n3. Navigating to teacher recruitment after login...');
    await page.goto('https://phuketsummercamp.com/admin/teacher-recruitment', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    currentUrl = page.url();
    console.log('   Current URL:', currentUrl);
    
    // Check what content is visible
    const pageTitle = await page.title();
    console.log('   Page title:', pageTitle);
    
    // Check if we see admin dashboard content
    const hasAdminDashboard = await page.locator('text="Admin Dashboard"').count() > 0;
    const hasTeacherRecruitment = await page.locator('text="Teacher Recruitment"').count() > 0;
    
    console.log('   Admin Dashboard visible:', hasAdminDashboard);
    console.log('   Teacher Recruitment visible:', hasTeacherRecruitment);
    
    // Check for any error messages
    const errorMessages = await page.locator('.error-message, .error, [role="alert"]').count();
    if (errorMessages > 0) {
      console.log('   ⚠️  Error messages found:', errorMessages);
    }
    
    // Try to find the teacher recruitment link in admin
    console.log('\n4. Looking for Teacher Recruitment link in admin menu...');
    const teacherLink = await page.locator('a:has-text("Teacher Recruitment")').count();
    console.log('   Teacher Recruitment link found:', teacherLink > 0);
    
    if (teacherLink > 0) {
      console.log('   Clicking Teacher Recruitment link...');
      await page.click('a:has-text("Teacher Recruitment")');
      await page.waitForTimeout(2000);
      
      currentUrl = page.url();
      console.log('   URL after clicking link:', currentUrl);
    }
    
    // Check console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('   Console error:', msg.text());
      }
    });
    
    console.log('\n5. Checking for database data...');
    // Check if any contacts are loading
    const contactItems = await page.locator('.contact-item').count();
    console.log('   Contact items found:', contactItems);
    
    if (contactItems === 0) {
      console.log('   ⚠️  No contacts loaded - possible database connection issue');
      
      // Check loading state
      const isLoading = await page.locator('.loading, .admin-loading').count() > 0;
      console.log('   Loading indicator visible:', isLoading);
    }
    
    // Keep browser open for manual inspection
    console.log('\n\nBrowser kept open for inspection. Press Ctrl+C to close.');
    await page.waitForTimeout(300000); // 5 minutes
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();