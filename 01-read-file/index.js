const fs = require('node:fs');
const path = require('node:path');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

stream.on('data', (chunk) => process.stdout.write(chunk));
stream.on('error', (error) => console.log('Error', error.message));
