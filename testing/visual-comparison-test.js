const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function compareSlideToOriginal(slideNumber, htmlFile) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Set viewport to match typical presentation dimensions
  await page.setViewportSize({ width: 1440, height: 810 });
  
  try {
    // Load the HTML file
    const filePath = 'file://' + path.resolve(__dirname, htmlFile);
    await page.goto(filePath);
    
    // Wait for all images to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Extra wait for animations
    
    // Take screenshot of our HTML version
    const htmlScreenshot = `screenshots/slide${slideNumber}-html.png`;
    await page.screenshot({ 
      path: htmlScreenshot, 
      fullPage: false,
      animations: 'disabled'
    });
    
    console.log(`✅ Screenshot saved: ${htmlScreenshot}`);
    
    // Now open the original slide for comparison
    const originalPath = 'file://' + path.resolve(__dirname, `references/img pres/${slideNumber}.jpg`);
    await page.goto(originalPath);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of original
    const originalScreenshot = `screenshots/slide${slideNumber}-original.png`;
    await page.screenshot({ 
      path: originalScreenshot,
      fullPage: false
    });
    
    console.log(`✅ Original saved: ${originalScreenshot}`);
    
    // Create a side-by-side comparison HTML
    const comparisonHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Slide ${slideNumber} Comparison</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #333;
        }
        .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2px;
            height: 100vh;
        }
        .image-container {
            position: relative;
            overflow: hidden;
            background: #000;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .label {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 14px;
        }
        .controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        button {
            padding: 8px 15px;
            margin: 0 5px;
            cursor: pointer;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
        }
        button:hover {
            background: #45a049;
        }
        .status {
            margin-top: 10px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="image-container">
            <img src="../${originalScreenshot}" alt="Original">
            <div class="label">ORIGINAL</div>
        </div>
        <div class="image-container">
            <img src="../${htmlScreenshot}" alt="HTML Version">
            <div class="label">HTML VERSION</div>
        </div>
    </div>
    <div class="controls">
        <h3>Slide ${slideNumber} Comparison</h3>
        <button onclick="window.location.href='../${htmlFile}'">View HTML Full Screen</button>
        <button onclick="window.location.reload()">Refresh</button>
        <div class="status">
            <strong>File:</strong> ${htmlFile}<br>
            <strong>Original:</strong> references/img pres/${slideNumber}.jpg
        </div>
    </div>
</body>
</html>`;
    
    // Save comparison HTML
    const comparisonFile = `screenshots/comparison-slide${slideNumber}.html`;
    fs.writeFileSync(comparisonFile, comparisonHtml);
    console.log(`✅ Comparison page created: ${comparisonFile}`);
    
    // Open comparison in browser
    await page.goto('file://' + path.resolve(__dirname, comparisonFile));
    
    // Keep browser open for manual inspection
    console.log('\n👀 Visual comparison is open in browser');
    console.log('Compare the two versions side by side');
    console.log('Press Ctrl+C to close when done\n');
    
    // Keep browser open
    await page.waitForTimeout(300000); // 5 minutes
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

// Create screenshots directory if it doesn't exist
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

// Test slide 2
compareSlideToOriginal(2, 'slide2-simple.html');

// To test other slides, add more calls:
// compareSlideToOriginal(3, 'slide3.html');
// compareSlideToOriginal(4, 'slide4.html');