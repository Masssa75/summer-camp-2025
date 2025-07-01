const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function deployWithCLI() {
  console.log('🚀 Starting Netlify deployment with CLI...');
  
  try {
    // Check if Netlify CLI is installed
    try {
      execSync('netlify --version', { stdio: 'ignore' });
      console.log('✅ Netlify CLI is installed');
    } catch (error) {
      console.log('📦 Installing Netlify CLI...');
      execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    }
    
    // Check if we're logged in
    try {
      const status = execSync('netlify status --json 2>&1', { encoding: 'utf8' });
      // If we get here without throwing, we're authenticated (even if not linked)
      console.log('✅ Netlify CLI is authenticated');
    } catch (error) {
      // Check if the error is just about not being linked
      if (error.stdout && error.stdout.includes("don't appear to be in a folder that is linked")) {
        console.log('✅ Netlify CLI is authenticated (project not linked yet)');
      } else {
        console.log('\n❌ Not logged in to Netlify');
        console.log('Please run: netlify login');
        console.log('Then run this script again');
        process.exit(1);
      }
    }
    
    // Create a new site
    console.log('\n🌐 Creating new Netlify site...');
    const siteName = `summer-camp-${Date.now()}`;
    
    try {
      const createOutput = execSync(
        `netlify sites:create --name ${siteName}`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      console.log('✅ Site created successfully');
    } catch (error) {
      console.log('Site creation output:', error.stdout);
    }
    
    // Link the site to current directory
    console.log('\n🔗 Linking site to current directory...');
    execSync(`netlify link --name ${siteName}`, { stdio: 'inherit' });
    
    // Deploy the built files
    console.log('\n📦 Deploying to Netlify...');
    const deployOutput = execSync('netlify deploy --prod --dir=.next', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(deployOutput);
    
    // Extract site URL
    let siteUrl = `https://${siteName}.netlify.app`;
    const urlMatch = deployOutput.match(/Website URL:\s+(.+)/);
    if (urlMatch) {
      siteUrl = urlMatch[1];
    }
    
    console.log(`\n✅ Deployment successful!`);
    console.log(`🌐 Site URL: ${siteUrl}`);
    
    // Set up continuous deployment with GitHub
    console.log('\n🔧 Setting up continuous deployment...');
    try {
      // First, we need to install the build plugin
      execSync('npm install --save-dev @netlify/plugin-nextjs', { stdio: 'inherit' });
      
      // Update netlify.toml for proper Next.js deployment
      const netlifyConfig = `[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
`;
      
      fs.writeFileSync(path.join(__dirname, 'netlify.toml'), netlifyConfig);
      console.log('✅ Updated netlify.toml for Next.js');
      
      // Try to set up GitHub integration
      console.log('\n📌 Setting up GitHub integration...');
      console.log('To enable continuous deployment:');
      console.log(`1. Go to https://app.netlify.com/sites/${siteName}/settings/deploys`);
      console.log('2. Click "Link repository" under "Build settings"');
      console.log('3. Select GitHub and authorize if needed');
      console.log('4. Choose repository: Masssa75/summer-camp-2025');
      console.log('5. Set branch to deploy: main');
      console.log('6. Build command: npm run build');
      console.log('7. Publish directory: .next');
      
    } catch (error) {
      console.log('Note: Manual GitHub setup required');
    }
    
    // Update .env.local with the site URL
    const envPath = path.join(__dirname, '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
      /NEXT_PUBLIC_APP_URL=.*/,
      `NEXT_PUBLIC_APP_URL=${siteUrl}`
    );
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Updated .env.local with site URL');
    
    return siteUrl;
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  deployWithCLI().then(url => {
    console.log(`\n🎉 Your site is live at: ${url}`);
  });
}

module.exports = { deployWithCLI };