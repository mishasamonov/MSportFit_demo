const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'env.example');
const dest = path.join(__dirname, '..', '.env');
fs.copyFileSync(src, dest);
console.log('Created server/.env from env.example');
