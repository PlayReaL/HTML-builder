const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

const destDir = path.join(__dirname, 'project-dist');

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

async function bundleStyles() {
  const bundleName = path.join(destDir, 'style.css');
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

async function bundleHtml() {
  let html = await fsPromises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  const entries = await fsPromises.readdir(path.join(__dirname, 'components'), {
    withFileTypes: true,
  });
  for (const entry of entries) {
    if (entry.isFile() && path.extname(entry.name) === '.html') {
      const data = await fsPromises.readFile(
        path.join(entry.path, entry.name),
        'utf-8',
      );
      const componentName = entry.name.slice(0, entry.name.lastIndexOf('.'));
      html = html.replaceAll(`{{${componentName}}}`, data);
    }
  }
  await fsPromises.writeFile(path.join(destDir, 'index.html'), html, 'utf-8');
}

async function bundle() {
  await fsPromises.rm(destDir, { force: true, recursive: true });
  await fsPromises.mkdir(destDir);

  await copyDir(path.join(__dirname, 'assets'), path.join(destDir, 'assets'));
  await bundleHtml();
  await bundleStyles();
}

bundle();
