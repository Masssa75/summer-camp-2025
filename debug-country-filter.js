const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Debugging country filter logic...');
  
  try {
    // Login first
    await page.goto('https://phuketsummercamp.com/test-auth', { waitUntil: 'networkidle' });
    await page.fill('input[type="password"]', 'test123');
    await page.click('button:has-text("Login")');
    await page.waitForURL('**/admin', { timeout: 10000 });
    
    // Go to teacher recruitment page
    await page.goto('https://phuketsummercamp.com/admin/teacher-recruitment', { waitUntil: 'networkidle' });
    
    // Get the current contacts and their locations for analysis
    console.log('\n=== ANALYZING CURRENT CONTACTS AND LOCATIONS ===');
    
    const contacts = await page.evaluate(() => {
      const contactItems = document.querySelectorAll('.contact-item');
      const results = [];
      
      contactItems.forEach(item => {
        const nameEl = item.querySelector('h3');
        const locationEl = item.querySelector('.contact-location');
        if (nameEl && locationEl) {
          results.push({
            name: nameEl.textContent.trim(),
            location: locationEl.textContent.trim()
          });
        }
      });
      
      return results;
    });
    
    console.log('All contacts with their locations:');
    contacts.forEach((contact, i) => {
      console.log(`  ${i+1}. ${contact.name} | Location: "${contact.location}"`);
    });
    
    // Test the country detection logic
    console.log('\n=== TESTING COUNTRY DETECTION LOGIC ===');
    
    const getCountryByLocation = (location) => {
      if (location.includes('Thailand') || location.includes('Bangkok') || location.includes('Phuket')) return 'TH';
      if (location.includes('Singapore')) return 'SG';
      if (location.includes('Malaysia')) return 'MY';
      if (location.includes('Indonesia') || location.includes('Bali')) return 'ID';
      if (location.includes('Philippines')) return 'PH';
      if (location.includes('Vietnam')) return 'VN';
      if (location.includes('Myanmar')) return 'MM';
      if (location.includes('Cambodia')) return 'KH';
      return null;
    };
    
    contacts.forEach(contact => {
      const detectedCountry = getCountryByLocation(contact.location);
      console.log(`  ${contact.name}: "${contact.location}" → ${detectedCountry || 'NO MATCH (shows in all countries!)'}`);
    });
    
    // Test Singapore filter
    console.log('\n=== TESTING SINGAPORE FILTER ===');
    await page.click('button:has-text("Countries")');
    await page.waitForTimeout(500);
    
    // Click Thailand checkbox to uncheck it (it's checked by default)
    await page.click('label:has-text("Thailand") input[type="checkbox"]');
    // Click Singapore checkbox to check it
    await page.click('label:has-text("Singapore") input[type="checkbox"]');
    
    await page.click('body'); // Close dropdown
    await page.waitForTimeout(1000);
    
    const singaporeContacts = await page.locator('.contact-item h3').allTextContents();
    console.log('Contacts showing when Singapore selected:', singaporeContacts.length);
    singaporeContacts.forEach((name, i) => console.log(`  ${i+1}. ${name}`));
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
})();