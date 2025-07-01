const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

class LiveSlideComparison {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'https://warm-hamster-50f715.netlify.app';
  }

  async init() {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    // Set to standard slide dimensions
    await this.page.setViewportSize({ width: 1440, height: 810 });
  }

  async compareSlide(slideNumber) {
    console.log(`\n🔍 Comparing Slide ${slideNumber}...`);
    
    try {
      // 1. Capture original slide
      const originalPath = path.resolve(__dirname, `../references/img pres/${slideNumber}.jpg`);
      if (!fs.existsSync(originalPath)) {
        console.error(`❌ Original slide ${slideNumber}.jpg not found`);
        return;
      }
      
      // 2. Navigate to live website and scroll to the specific slide
      console.log(`📱 Loading live website...`);
      await this.page.goto(this.baseUrl);
      await this.page.waitForLoadState('networkidle');
      
      // Find the slide section (assuming sections have IDs or classes like slide-2, slide-3, etc.)
      const slideSelector = `.slide-${slideNumber}, #slide-${slideNumber}, [data-slide="${slideNumber}"]`;
      
      // Try to find the slide
      const slideElement = await this.page.$(slideSelector);
      if (slideElement) {
        // Scroll to the slide
        await slideElement.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500); // Wait for scroll animation
        
        // Take screenshot of just this slide section
        const liveScreenshot = `screenshots/slide${slideNumber}-live.png`;
        await slideElement.screenshot({ path: liveScreenshot });
        console.log(`✅ Live screenshot captured`);
      } else {
        // If no specific slide element, take full page screenshot at position
        console.log(`⚠️ Specific slide element not found, taking viewport screenshot`);
        const liveScreenshot = `screenshots/slide${slideNumber}-live.png`;
        await this.page.screenshot({ path: liveScreenshot, fullPage: false });
      }
      
      // 3. Create side-by-side comparison
      await this.createComparison(slideNumber);
      
    } catch (error) {
      console.error(`❌ Error comparing slide ${slideNumber}:`, error.message);
    }
  }

  async createComparison(slideNumber) {
    const comparisonHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Slide ${slideNumber} - Live Comparison</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, Arial, sans-serif;
            background: #1a1a1a;
            color: #fff;
            height: 100vh;
            overflow: hidden;
        }
        
        .header {
            background: #2a2a2a;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #444;
        }
        
        h1 {
            font-size: 20px;
            font-weight: 400;
        }
        
        .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2px;
            height: calc(100vh - 60px);
            background: #000;
        }
        
        .image-container {
            position: relative;
            overflow: auto;
            background: #1a1a1a;
        }
        
        img {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .label {
            position: fixed;
            top: 70px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 8px 15px;
            border-radius: 0 0 5px 0;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            z-index: 10;
        }
        
        .label-original { left: 0; }
        .label-live { left: 50%; }
        
        .controls {
            display: flex;
            gap: 10px;
        }
        
        button {
            background: #444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }
        
        button:hover {
            background: #555;
        }
        
        button.primary {
            background: #4CAF50;
        }
        
        button.primary:hover {
            background: #45a049;
        }
        
        .status {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.9);
            padding: 15px;
            border-radius: 8px;
            font-size: 12px;
            line-height: 1.6;
        }
        
        .overlay-mode {
            position: relative;
        }
        
        .overlay-mode .image-container:last-child {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.5;
            mix-blend-mode: difference;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Slide ${slideNumber} Comparison</h1>
        <div class="controls">
            <button onclick="toggleOverlay()">Toggle Overlay</button>
            <button onclick="window.open('${this.baseUrl}', '_blank')" class="primary">View Live Site</button>
            <button onclick="location.reload()">Refresh</button>
        </div>
    </div>
    
    <div class="container" id="container">
        <div class="image-container">
            <div class="label label-original">ORIGINAL DESIGN</div>
            <img src="../../references/img pres/${slideNumber}.jpg" alt="Original">
        </div>
        <div class="image-container">
            <div class="label label-live">LIVE WEBSITE</div>
            <img src="../screenshots/slide${slideNumber}-live.png" alt="Live">
        </div>
    </div>
    
    <div class="status">
        <strong>Slide ${slideNumber}</strong><br>
        <small>
            Original: img pres/${slideNumber}.jpg<br>
            Live URL: ${this.baseUrl}<br>
            Generated: ${new Date().toLocaleString()}
        </small>
    </div>
    
    <script>
        let overlayMode = false;
        
        function toggleOverlay() {
            overlayMode = !overlayMode;
            const container = document.getElementById('container');
            if (overlayMode) {
                container.classList.add('overlay-mode');
            } else {
                container.classList.remove('overlay-mode');
            }
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'o') toggleOverlay();
            if (e.key === 'r') location.reload();
        });
    </script>
</body>
</html>`;

    const comparisonFile = `comparisons/slide${slideNumber}-comparison.html`;
    fs.writeFileSync(comparisonFile, comparisonHtml);
    
    // Open comparison in browser
    await this.page.goto('file://' + path.resolve(__dirname, comparisonFile));
    console.log(`\n✅ Comparison ready: ${comparisonFile}`);
  }

  async testAllSlides() {
    // Get all slide images from img pres folder
    const imgPresPath = path.resolve(__dirname, '../references/img pres');
    const files = fs.readdirSync(imgPresPath);
    const slideNumbers = files
      .filter(f => f.endsWith('.jpg'))
      .map(f => parseInt(f.replace('.jpg', '')))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
    
    console.log(`Found ${slideNumbers.length} slides to test: ${slideNumbers.join(', ')}`);
    
    for (const slideNum of slideNumbers) {
      await this.compareSlide(slideNum);
      await this.page.waitForTimeout(2000); // Brief pause between slides
    }
  }

  async testSingleSlide(slideNumber) {
    await this.compareSlide(slideNumber);
    
    console.log('\n📝 Next Steps:');
    console.log('1. Review the visual comparison');
    console.log('2. Note differences in layout, colors, spacing');
    console.log('3. Update the live website code');
    console.log('4. Re-run this test to see improvements');
    console.log('\nPress Ctrl+C to exit when done reviewing');
    
    // Keep browser open
    await new Promise(() => {}); // Infinite wait
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const tester = new LiveSlideComparison();
  
  try {
    await tester.init();
    
    // Get command line argument for specific slide or test all
    const slideArg = process.argv[2];
    
    if (slideArg && !isNaN(parseInt(slideArg))) {
      // Test specific slide
      await tester.testSingleSlide(parseInt(slideArg));
    } else if (slideArg === 'all') {
      // Test all slides
      await tester.testAllSlides();
    } else {
      // Default: test slide 2
      console.log('Usage: node test-live-slides.js [slide-number|all]');
      console.log('Testing slide 2 by default...\n');
      await tester.testSingleSlide(2);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await tester.cleanup();
  }
}

main();