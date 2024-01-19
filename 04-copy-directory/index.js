const fsPromises = require('node:fs/promises');
const path = require('node:path');

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

async function copyDir(src, dest) {
  await fsPromises.rm(dest, { force: true, recursive: true });
  await fsPromises.mkdir(dest);
  const entries = await fsPromises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile()) {
      await fsPromises.copyFile(
        path.join(src, entry.name),
        path.join(dest, entry.name),
      );
    } else if (entry.isDirectory()) {
      await copyDir(path.join(src, entry.name), path.join(dest, entry.name));
    }
  }
}

copyDir(srcDir, destDir);
