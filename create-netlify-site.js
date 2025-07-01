const fetch = require('node-fetch');
const { execSync } = require('child_process');
const fs = require('fs');

async function createNetlifySite() {
  try {
    // Get Netlify access token from OAuth credentials
    console.log('🔐 Getting Netlify access token...');
    
    // First, let's use the Netlify CLI with the OAuth credentials
    const clientId = 's9s_p9EuoRSeHO8AD6db-BfFW4ocwtrXyAgtg6TZEgU';
    const clientSecret = 'QJyjrVZhP-t3skAULWGKKgG3PDeVw1yWER0ZrXWF1kQ';
    
    // For now, let's use manual token approach
    console.log('Please run the following command to get a Netlify access token:');
    console.log('netlify login');
    console.log('Then run: netlify sites:create --name summer-camp-waldorf-2025');
    console.log('Finally run: netlify link');
    console.log('And then: npm run build && netlify deploy --prod');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createNetlifySite();