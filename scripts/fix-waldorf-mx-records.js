#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const GODADDY_API_KEY = process.env.GODADDY_API_KEY;
const GODADDY_API_SECRET = process.env.GODADDY_API_SECRET;
const DOMAIN = 'waldorfphuket.com';

// GoDaddy API configuration
const API_BASE_URL = 'https://api.godaddy.com/v1';
const headers = {
  'Authorization': `sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}`,
  'Content-Type': 'application/json'
};

// Google Workspace MX records
const GOOGLE_MX_RECORDS = [
  { data: 'ASPMX.L.GOOGLE.COM', priority: 1, ttl: 3600 },
  { data: 'ALT1.ASPMX.L.GOOGLE.COM', priority: 5, ttl: 3600 },
  { data: 'ALT2.ASPMX.L.GOOGLE.COM', priority: 5, ttl: 3600 },
  { data: 'ALT3.ASPMX.L.GOOGLE.COM', priority: 10, ttl: 3600 },
  { data: 'ALT4.ASPMX.L.GOOGLE.COM', priority: 10, ttl: 3600 }
];

async function getCurrentRecords() {
  try {
    console.log(`\n📋 Fetching current DNS records for ${DOMAIN}...`);
    const response = await axios.get(`${API_BASE_URL}/domains/${DOMAIN}/records`, { headers });
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching DNS records:', error.response?.data || error.message);
    process.exit(1);
  }
}

async function updateDNSRecords(records) {
  try {
    console.log('\n🔄 Updating DNS records...');
    const response = await axios.put(
      `${API_BASE_URL}/domains/${DOMAIN}/records`,
      records,
      { headers }
    );
    console.log('✅ DNS records updated successfully!');
    return response.data;
  } catch (error) {
    console.error('❌ Error updating DNS records:', error.response?.data || error.message);
    process.exit(1);
  }
}

async function fixMXRecords() {
  // Get current records
  const currentRecords = await getCurrentRecords();
  
  console.log(`\n📊 Current DNS record summary:`);
  const recordTypes = {};
  currentRecords.forEach(record => {
    recordTypes[record.type] = (recordTypes[record.type] || 0) + 1;
  });
  Object.entries(recordTypes).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} record(s)`);
  });

  // Filter out old MX records and problematic A records
  const filteredRecords = currentRecords.filter(record => {
    // Remove all existing MX records (we'll add Google's)
    if (record.type === 'MX') {
      console.log(`   🗑️  Removing old MX record: ${record.data}`);
      return false;
    }
    
    // Remove A records pointing to old IPs
    if (record.type === 'A' && record.name === '@' && 
        (record.data === '15.197.142.173' || record.data === '3.33.152.147')) {
      console.log(`   🗑️  Removing old A record: ${record.data}`);
      return false;
    }
    
    // Remove problematic www CNAME that points to itself
    if (record.type === 'CNAME' && record.name === 'www' && record.data === 'waldorfphuket.com') {
      console.log(`   🗑️  Removing looping CNAME record for www`);
      return false;
    }
    
    return true;
  });

  // Add Google Workspace MX records
  console.log('\n✉️  Adding Google Workspace MX records:');
  GOOGLE_MX_RECORDS.forEach(mx => {
    console.log(`   ➕ ${mx.data} (priority: ${mx.priority})`);
    filteredRecords.push({
      type: 'MX',
      name: '@',
      data: mx.data,
      priority: mx.priority,
      ttl: mx.ttl
    });
  });

  // Update DNS records
  await updateDNSRecords(filteredRecords);

  console.log('\n🎉 MX records have been fixed!');
  console.log('\n⏰ DNS propagation can take up to 48 hours, but usually completes within 1-4 hours.');
  console.log('📧 After propagation, emails to info@waldorfphuket.com will be delivered to Google Workspace.');
  console.log('\n💡 You can test email delivery in a few hours by sending a test email to info@waldorfphuket.com');
}

// Check if API credentials are available
if (!GODADDY_API_KEY || !GODADDY_API_SECRET) {
  console.error('❌ Error: GoDaddy API credentials not found in .env.local');
  console.error('Please ensure GODADDY_API_KEY and GODADDY_API_SECRET are set.');
  process.exit(1);
}

// Run the fix
console.log('🔧 Fixing MX records for waldorfphuket.com...');
fixMXRecords().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});