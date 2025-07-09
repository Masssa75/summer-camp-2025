const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Starting print-quality poster export...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-web-security', '--force-device-scale-factor=6'] 
  });
  
  const page = await browser.newPage();
  
  // Create a custom HTML with scaled up poster for print quality
  const printHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
        }
        /* Scale everything up by 6x for print quality */
        #print-wrapper {
            width: 4200px;  /* 700px * 6 */
            height: 6000px; /* 1000px * 6 */
            transform-origin: top left;
        }
        #print-wrapper iframe {
            width: 700px;
            height: 1000px;
            border: none;
            transform: scale(6);
            transform-origin: top left;
        }
    </style>
</head>
<body>
    <div id="print-wrapper">
        <iframe src="${path.resolve(__dirname, 'mockups/summer-camp-poster-70x100-v2.html')}"></iframe>
    </div>
</body>
</html>`;

  await page.setContent(printHTML);
  await page.waitForTimeout(5000); // Wait for iframe to load
  
  // Set viewport to capture the full scaled poster
  await page.setViewportSize({
    width: 4200,
    height: 6000
  });
  
  // Export the scaled poster
  console.log('Exporting at print quality (4200x6000 pixels)...');
  await page.screenshot({
    path: 'summer-camp-poster-print-quality.jpg',
    quality: 100,
    type: 'jpeg',
    fullPage: false,
    clip: {
      x: 0,
      y: 0,
      width: 4200,
      height: 6000
    }
  });
  
  console.log('Exporting as PNG (lossless, large file)...');
  await page.screenshot({
    path: 'summer-camp-poster-print-quality.png',
    type: 'png',
    fullPage: false,
    clip: {
      x: 0,
      y: 0,
      width: 4200,
      height: 6000
    }
  });
  
  await browser.close();
  
  console.log('\nExport complete!');
  console.log('\nFiles created:');
  console.log('- summer-camp-poster-print-quality.jpg (4200x6000 pixels)');
  console.log('- summer-camp-poster-print-quality.png (4200x6000 pixels)');
  console.log('\nThese are suitable for printing at 70x100cm with good quality.');
  console.log('The PNG file is recommended for best quality (no compression).');
})();