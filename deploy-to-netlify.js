const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function deployToNetlify() {
  console.log('🚀 Starting Netlify deployment...');
  
  try {
    // Install Netlify CLI if not installed
    try {
      execSync('netlify --version', { stdio: 'ignore' });
    } catch (error) {
      console.log('Installing Netlify CLI...');
      execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    }

    // Build the project
    console.log('📦 Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    // Deploy to Netlify
    console.log('🌐 Deploying to Netlify...');
    const deployOutput = execSync('netlify deploy --prod --dir=.next', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(deployOutput);
    
    // Extract site URL from output
    const urlMatch = deployOutput.match(/Website URL:\s+(.+)/);
    if (urlMatch) {
      console.log(`\n✅ Deployment successful!`);
      console.log(`🌐 Site URL: ${urlMatch[1]}`);
      
      // Update .env.local with the site URL
      const envPath = path.join(__dirname, '.env.local');
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(
        /NEXT_PUBLIC_APP_URL=.*/,
        `NEXT_PUBLIC_APP_URL=${urlMatch[1]}`
      );
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Updated .env.local with site URL');
    }
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deployToNetlify();