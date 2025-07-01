const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

class SlideBuilder {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1440, height: 810 });
  }

  async analyzeOriginalSlide(slideNumber) {
    console.log(`\n📊 Analyzing original slide ${slideNumber}...`);
    
    // Load original slide
    const originalPath = 'file://' + path.resolve(__dirname, `references/img pres/${slideNumber}.jpg`);
    await this.page.goto(originalPath);
    await this.page.waitForLoadState('networkidle');
    
    // Take screenshot for reference
    await this.page.screenshot({ 
      path: `analysis/slide${slideNumber}-original.png`,
      fullPage: false
    });
    
    // Visual analysis notes (manual for now, could be automated with AI)
    const analysis = {
      slideNumber,
      layout: 'Identify layout type (split, full-width, grid, etc.)',
      backgroundColor: 'Main background color',
      textElements: 'List all text content',
      images: 'List all images and their positions',
      specialEffects: 'Rounded corners, shadows, overlays, etc.'
    };
    
    console.log('📝 Analysis template created');
    return analysis;
  }

  async testHTMLVersion(slideNumber, htmlFile) {
    console.log(`\n🧪 Testing ${htmlFile}...`);
    
    const filePath = 'file://' + path.resolve(__dirname, htmlFile);
    await this.page.goto(filePath);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
    
    // Take screenshot
    const timestamp = Date.now();
    const screenshotPath = `iterations/slide${slideNumber}-v${timestamp}.png`;
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: false
    });
    
    // Check common issues
    const issues = [];
    
    // Check if images are loading
    const brokenImages = await this.page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.filter(img => !img.complete || img.naturalHeight === 0).length;
    });
    
    if (brokenImages > 0) {
      issues.push(`❌ ${brokenImages} broken images detected`);
    }
    
    // Check viewport coverage
    const bodyHeight = await this.page.evaluate(() => document.body.scrollHeight);
    if (bodyHeight > 810) {
      issues.push(`⚠️ Content extends beyond viewport (${bodyHeight}px)`);
    }
    
    // Check for responsive issues
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.page.waitForTimeout(300);
    const mobileScreenshot = `iterations/slide${slideNumber}-mobile-v${timestamp}.png`;
    await this.page.screenshot({ path: mobileScreenshot });
    
    // Reset to desktop
    await this.page.setViewportSize({ width: 1440, height: 810 });
    
    console.log('\n📊 Test Results:');
    if (issues.length === 0) {
      console.log('✅ All basic checks passed');
    } else {
      issues.forEach(issue => console.log(issue));
    }
    
    return {
      screenshotPath,
      mobileScreenshot,
      issues,
      timestamp
    };
  }

  async createComparisonView(slideNumber, htmlFile, testResult) {
    const comparisonHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Slide ${slideNumber} - Iterative Comparison</title>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, Arial, sans-serif;
            background: #1a1a1a;
            color: white;
        }
        .header {
            background: #2a2a2a;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #444;
        }
        h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 300;
        }
        .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 20px;
            max-width: 1600px;
            margin: 0 auto;
        }
        .image-box {
            background: #2a2a2a;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
        }
        .image-box img {
            width: 100%;
            height: auto;
            display: block;
        }
        .label {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .issues {
            background: #2a2a2a;
            border-radius: 8px;
            padding: 20px;
            margin: 20px;
        }
        .issues h3 {
            margin-top: 0;
            color: #ff6b6b;
        }
        .issues ul {
            margin: 0;
            padding-left: 20px;
        }
        .issues li {
            margin: 5px 0;
        }
        .controls {
            text-align: center;
            padding: 20px;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin: 0 10px;
            transition: background 0.3s;
        }
        button:hover {
            background: #45a049;
        }
        .success {
            color: #4CAF50;
        }
        .warning {
            color: #ff9800;
        }
        .error {
            color: #f44336;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Slide ${slideNumber} - Visual Comparison & Testing</h1>
        <p>Comparing original design with HTML implementation</p>
    </div>
    
    <div class="container">
        <div class="image-box">
            <img src="../references/img pres/${slideNumber}.jpg" alt="Original Design">
            <div class="label">Original Design</div>
        </div>
        <div class="image-box">
            <img src="../${testResult.screenshotPath}" alt="HTML Implementation">
            <div class="label">HTML Implementation</div>
        </div>
    </div>
    
    ${testResult.issues.length > 0 ? `
    <div class="issues">
        <h3>⚠️ Issues Detected:</h3>
        <ul>
            ${testResult.issues.map(issue => `<li>${issue}</li>`).join('')}
        </ul>
    </div>
    ` : `
    <div class="issues success">
        <h3>✅ All Tests Passed!</h3>
        <p>The HTML implementation appears to be working correctly.</p>
    </div>
    `}
    
    <div class="controls">
        <button onclick="window.open('../${htmlFile}', '_blank')">View HTML Full Screen</button>
        <button onclick="window.open('../${testResult.mobileScreenshot}', '_blank')">View Mobile Version</button>
        <button onclick="location.reload()">Refresh Comparison</button>
    </div>
    
    <div style="padding: 20px; text-align: center; color: #666;">
        <small>Generated at ${new Date(testResult.timestamp).toLocaleString()}</small>
    </div>
</body>
</html>`;

    const comparisonFile = `comparisons/slide${slideNumber}-comparison.html`;
    fs.writeFileSync(comparisonFile, comparisonHtml);
    
    // Open in browser
    await this.page.goto('file://' + path.resolve(__dirname, comparisonFile));
    
    return comparisonFile;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Create necessary directories
['analysis', 'iterations', 'comparisons', 'screenshots'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// Usage
async function buildAndTestSlide(slideNumber, htmlFile) {
  const builder = new SlideBuilder();
  
  try {
    await builder.init();
    
    // Analyze original
    const analysis = await builder.analyzeOriginalSlide(slideNumber);
    
    // Test HTML version
    const testResult = await builder.testHTMLVersion(slideNumber, htmlFile);
    
    // Create comparison
    const comparisonFile = await builder.createComparisonView(slideNumber, htmlFile, testResult);
    
    console.log(`\n✅ Comparison ready: ${comparisonFile}`);
    console.log('👀 Browser window is open for visual comparison');
    console.log('🔄 Make changes to the HTML file and re-run to see improvements\n');
    
    // Keep open for inspection
    await new Promise(resolve => {
      console.log('Press Ctrl+C when done reviewing...');
      process.on('SIGINT', resolve);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await builder.cleanup();
  }
}

// Test slide 2
buildAndTestSlide(2, 'slide2-simple.html');