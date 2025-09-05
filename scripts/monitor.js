const axios = require('axios');
const cron = require('node-cron');

const ENDPOINTS = [
  'http://localhost:5000/api/health',
  'http://localhost:3000'
];

const checkEndpoint = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    console.log(`✅ ${url} - Status: ${response.status}`);
    return true;
  } catch (error) {
    console.error(`❌ ${url} - Error: ${error.message}`);
    // Send alert (email, Slack, etc.)
    return false;
  }
};

const healthCheck = async () => {
  console.log(`🔍 Health check started at ${new Date().toISOString()}`);
  
  for (const endpoint of ENDPOINTS) {
    await checkEndpoint(endpoint);
  }
  
  console.log('🔍 Health check completed\n');
};

// Run health check every 5 minutes
cron.schedule('*/5 * * * *', healthCheck);

// Initial check
healthCheck();

console.log('🎵 MusicStream Pro monitoring started');
