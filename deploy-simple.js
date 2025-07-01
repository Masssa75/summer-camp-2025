const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function deploySimple() {
  console.log('🚀 Starting simplified Netlify deployment...');
  
  try {
    // Check if already linked
    let isLinked = false;
    let siteId = null;
    
    try {
      const linkStatus = execSync('netlify status --json', { encoding: 'utf8' });
      const statusData = JSON.parse(linkStatus);
      if (statusData.siteData && statusData.siteData.id) {
        isLinked = true;
        siteId = statusData.siteData.id;
        console.log('✅ Site already linked:', statusData.siteData.name);
      }
    } catch (e) {
      console.log('📌 No existing site link found');
    }
    
    if (!isLinked) {
      // Create and link in one step using non-interactive mode
      console.log('\n🌐 Creating and linking new Netlify site...');
      const siteName = `summer-camp-${Date.now()}`;
      
      try {
        // Create site using team flag to avoid interactive prompt
        execSync(`netlify sites:create --name ${siteName} --team Cyrator`, { 
          stdio: 'inherit' 
        });
        
        // Now link it
        execSync(`netlify link --name ${siteName}`, { stdio: 'inherit' });
        
      } catch (error) {
        console.log('Trying alternative approach...');
        // Alternative: just deploy without creating site first
      }
    }
    
    // Deploy the site
    console.log('\n📦 Deploying to Netlify (this will create a site if needed)...');
    const deployOutput = execSync('netlify deploy --prod --dir=.next --json', { 
      encoding: 'utf8'
    });
    
    let deployData;
    try {
      deployData = JSON.parse(deployOutput);
    } catch (e) {
      // Fallback to text parsing
      console.log(deployOutput);
    }
    
    let siteUrl;
    if (deployData && deployData.deploy_url) {
      siteUrl = deployData.url || deployData.deploy_url;
    } else {
      // Try to extract from text output
      const urlMatch = deployOutput.match(/Website URL:\s+(.+)/);
      if (urlMatch) {
        siteUrl = urlMatch[1];
      } else {
        // Get site info
        const siteInfo = execSync('netlify sites:list --json', { encoding: 'utf8' });
        const sites = JSON.parse(siteInfo);
        if (sites.length > 0) {
          siteUrl = sites[0].ssl_url || sites[0].url;
        }
      }
    }
    
    console.log(`\n✅ Deployment successful!`);
    console.log(`🌐 Site URL: ${siteUrl}`);
    
    // Update netlify.toml for Next.js
    const netlifyConfig = `[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  directory = "netlify/functions"

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
    console.log('✅ Updated netlify.toml');
    
    // Update .env.local
    if (siteUrl) {
      const envPath = path.join(__dirname, '.env.local');
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(
        /NEXT_PUBLIC_APP_URL=.*/,
        `NEXT_PUBLIC_APP_URL=${siteUrl}`
      );
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Updated .env.local with site URL');
    }
    
    // Instructions for GitHub integration
    console.log('\n📌 To enable continuous deployment with GitHub:');
    console.log('1. Go to Netlify dashboard: https://app.netlify.com');
    console.log('2. Select your site');
    console.log('3. Go to Site settings > Build & deploy > Continuous deployment');
    console.log('4. Click "Link site to repository"');
    console.log('5. Choose GitHub and select: Masssa75/summer-camp-2025');
    console.log('6. Use these build settings:');
    console.log('   - Branch: main');
    console.log('   - Build command: npm run build');
    console.log('   - Publish directory: .next');
    
    return siteUrl;
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  deploySimple().then(url => {
    console.log(`\n🎉 Your site is live at: ${url}`);
  });
}

module.exports = { deploySimple };