// Simple script to test if the backend is working
const http = require('http');

// Test the health endpoint
const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/health',
  method: 'GET'
};

console.log('Testing connection to backend server...');

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('RESPONSE:', data);
    console.log('\nBackend server is running and responding correctly!');
  });
});

req.on('error', (e) => {
  console.error('\nConnection failed. The backend server is not running or not accessible.');
  console.error(`Error details: ${e.message}`);
  console.error('\nPlease start the backend server with: node server.js');
});

req.end(); 