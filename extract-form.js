const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Navigating to Google Form...');
  await page.goto('https://docs.google.com/forms/d/e/1FAIpQLSeLDQeUkIhmGfAxytCDuUWUhJG1IQW7yuFA0CT5juV2CHo7dw/viewform?pli=1');
  
  // Wait for form to load
  await page.waitForTimeout(5000);
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'google-form.png', fullPage: true });
  
  console.log('\n=== FORM TITLE ===');
  try {
    const title = await page.textContent('.freebirdFormviewerViewHeaderTitle');
    console.log(title);
  } catch (e) {
    console.log('Could not find title');
  }
  
  console.log('\n=== FORM DESCRIPTION ===');
  try {
    const description = await page.textContent('.freebirdFormviewerViewHeaderDescription');
    console.log(description);
  } catch (e) {
    console.log('No description found');
  }
  
  console.log('\n=== FORM FIELDS ===');
  
  // Get all form fields
  const formFields = await page.$$eval('.freebirdFormviewerComponentsQuestionBaseRoot', items => {
    return items.map(item => {
      const questionText = item.querySelector('[role="heading"]')?.textContent || '';
      const isRequired = item.querySelector('[aria-label="Required question"]') !== null;
      
      // Check field type
      let fieldType = 'unknown';
      let options = [];
      
      if (item.querySelector('input[type="text"]')) {
        fieldType = 'text';
      } else if (item.querySelector('textarea')) {
        fieldType = 'textarea';
      } else if (item.querySelector('input[type="date"]')) {
        fieldType = 'date';
      } else if (item.querySelector('[role="radiogroup"]')) {
        fieldType = 'radio';
        options = Array.from(item.querySelectorAll('[role="radio"]')).map(opt => 
          opt.getAttribute('aria-label') || opt.textContent
        );
      } else if (item.querySelector('[role="group"][aria-label*="checkbox"]')) {
        fieldType = 'checkbox';
        options = Array.from(item.querySelectorAll('[role="checkbox"]')).map(opt => 
          opt.getAttribute('aria-label') || opt.textContent
        );
      } else if (item.querySelector('[role="listbox"]')) {
        fieldType = 'dropdown';
        // Click to see options if needed
      }
      
      return {
        question: questionText.replace('Required question', '').trim(),
        required: isRequired,
        type: fieldType,
        options: options
      };
    });
  });
  
  formFields.forEach((field, index) => {
    console.log(`\n${index + 1}. ${field.question}`);
    console.log(`   Type: ${field.type}`);
    console.log(`   Required: ${field.required ? 'Yes' : 'No'}`);
    if (field.options.length > 0) {
      console.log(`   Options:`);
      field.options.forEach(opt => console.log(`     - ${opt}`));
    }
  });
  
  // Check for sections
  console.log('\n=== CHECKING FOR MULTIPLE SECTIONS ===');
  const sections = await page.$$('[role="button"][aria-label*="section"]');
  console.log(`Found ${sections.length} section(s)`);
  
  await page.waitForTimeout(3000);
  await browser.close();
})();