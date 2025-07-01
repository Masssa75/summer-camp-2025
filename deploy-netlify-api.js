const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const FormData = require('form-data');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

async function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      if (typeof data === 'string') {
        req.write(data);
      } else if (data instanceof FormData) {
        data.pipe(req);
      }
    }
    
    req.end();
  });
}

async function getAccessToken() {
  console.log('🔐 Attempting to get Netlify access token...');
  
  // Check if we have a token in environment
  if (process.env.NETLIFY_ACCESS_TOKEN) {
    console.log('✅ Found NETLIFY_ACCESS_TOKEN in environment');
    return process.env.NETLIFY_ACCESS_TOKEN;
  }
  
  // Check if netlify CLI has stored token
  try {
    const homeDir = require('os').homedir();
    const configPath = path.join(homeDir, '.netlify', 'config.json');
    
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.users && Object.keys(config.users).length > 0) {
        const userId = Object.keys(config.users)[0];
        const token = config.users[userId].auth?.token;
        if (token) {
          console.log('✅ Found token in Netlify CLI config');
          return token;
        }
      }
    }
  } catch (error) {
    console.log('No Netlify CLI config found');
  }
  
  // If no token found, we need to authenticate
  console.log('\n❌ No Netlify access token found.');
  console.log('\nTo get a personal access token:');
  console.log('1. Go to https://app.netlify.com/user/applications#personal-access-tokens');
  console.log('2. Click "New access token"');
  console.log('3. Give it a name and click "Generate token"');
  console.log('4. Add it to .env.local as NETLIFY_ACCESS_TOKEN=your_token_here');
  console.log('\nAlternatively, run: netlify login');
  
  throw new Error('No Netlify access token available');
}

async function createSite(token) {
  console.log('🌐 Creating new Netlify site...');
  
  const siteData = {
    name: `summer-camp-${Date.now()}`, // Unique name
    repo: {
      provider: 'github',
      repo: 'Masssa75/summer-camp-2025',
      branch: 'main',
      cmd: 'npm run build',
      dir: '.next'
    }
  };
  
  const options = {
    hostname: 'api.netlify.com',
    port: 443,
    path: '/api/v1/sites',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(siteData))
    }
  };
  
  try {
    const response = await makeRequest(options, JSON.stringify(siteData));
    console.log('✅ Site created successfully!');
    return response.body;
  } catch (error) {
    console.error('Error creating site:', error.message);
    throw error;
  }
}

async function deployFiles(token, siteId) {
  console.log('📦 Deploying files to Netlify...');
  
  // Create a zip of the .next folder
  console.log('Creating deployment package...');
  execSync('cd .next && zip -r ../deploy.zip . -q', { stdio: 'inherit' });
  
  const deployData = {
    async: false,
    branch: 'main'
  };
  
  // First create the deploy
  const createDeployOptions = {
    hostname: 'api.netlify.com',
    port: 443,
    path: `/api/v1/sites/${siteId}/deploys`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(deployData))
    }
  };
  
  try {
    const deployResponse = await makeRequest(createDeployOptions, JSON.stringify(deployData));
    const deployId = deployResponse.body.id;
    
    console.log('Uploading files...');
    
    // Upload the zip file
    const form = new FormData();
    form.append('file', fs.createReadStream('deploy.zip'));
    
    const uploadOptions = {
      hostname: 'api.netlify.com',
      port: 443,
      path: `/api/v1/deploys/${deployId}/files/.next`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...form.getHeaders()
      }
    };
    
    await makeRequest(uploadOptions, form);
    
    // Clean up
    fs.unlinkSync('deploy.zip');
    
    console.log('✅ Files deployed successfully!');
    return deployResponse.body;
  } catch (error) {
    console.error('Error deploying files:', error.message);
    throw error;
  }
}

async function main() {
  try {
    // Get access token
    const token = await getAccessToken();
    
    // Create site
    const site = await createSite(token);
    console.log(`\nSite ID: ${site.id}`);
    console.log(`Site Name: ${site.name}`);
    console.log(`Admin URL: ${site.admin_url}`);
    
    // Deploy files
    const deploy = await deployFiles(token, site.id);
    
    console.log('\n✅ Deployment complete!');
    console.log(`🌐 Live URL: https://${site.name}.netlify.app`);
    console.log(`📊 Deploy URL: ${deploy.deploy_url || deploy.url}`);
    
    // Update .env.local with the site URL
    const envPath = path.join(__dirname, '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
      /NEXT_PUBLIC_APP_URL=.*/,
      `NEXT_PUBLIC_APP_URL=https://${site.name}.netlify.app`
    );
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Updated .env.local with site URL');
    
    return `https://${site.name}.netlify.app`;
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };