const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

async function bundleStyles() {
  const bundleName = path.join(__dirname, 'project-dist', 'bundle.css');
  await fsPromises.rm(bundleName, { force: true, recursive: true });
  const entries = await fsPromises.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });
  const output = fs.createWriteStream(bundleName);
  for (const entry of entries) {
    if (entry.isFile() && path.extname(entry.name) === '.css') {
      const stream = fs.createReadStream(
        path.join(__dirname, 'styles', entry.name),
        'utf-8',
      );
      stream.pipe(output);
    }
  }
}

bundleStyles();
