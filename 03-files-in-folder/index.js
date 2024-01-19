const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

function printFileEntryFactory(fileName) {
  return function (error, stats) {
    if (error) {
      console.error(error);
      return;
    }
    if (stats.isFile()) {
      const f = fileName.split('.');
      console.log(`${f[0]} - ${f[1]} - ${stats.size / 1000}kb`);
    }
  };
}

fsPromises
  .readdir(path.join(__dirname, 'secret-folder'), {
    withFileTypes: true,
  })
  .then((dirEntries) =>
    dirEntries.map((v) =>
      fs.stat(path.join(v.path, v.name), printFileEntryFactory(v.name)),
    ),
  );
