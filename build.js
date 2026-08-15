require('dotenv').config();
const fs = require('fs');
const path = require('path');

const backendUrl = process.env.BACKEND_URL;
let envContent = '';

if (backendUrl) {
  envContent = `window.APP_ENV = { BACKEND_URL: "${backendUrl}" };\n`;
  console.log('Injected BACKEND_URL:', backendUrl);
} else {
  // If no env is provided, the client will fall back to its defaults in api.js
  envContent = `window.APP_ENV = {};\n`;
  console.log('No BACKEND_URL environment variable found. Client will use default fallbacks.');
}

// Ensure the directory exists
const clientJsDir = path.join(__dirname, 'client', 'js');
if (!fs.existsSync(clientJsDir)) {
  fs.mkdirSync(clientJsDir, { recursive: true });
}

fs.writeFileSync(path.join(clientJsDir, 'env.js'), envContent);
console.log('Successfully generated client/js/env.js');
