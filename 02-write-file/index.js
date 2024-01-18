const fs = require('node:fs');
const path = require('node:path');

const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

function exit() {
  process.stdout.write('Execution finish.');
  process.exit();
}

function processChunk(chunk) {
  if (chunk.toString() === 'exit\n' || chunk.toString() === 'exit\r\n') {
    exit();
  } else {
    stream.write(chunk);
  }
}

process.stdin.on('data', processChunk);
process.on('SIGINT', () => exit());
