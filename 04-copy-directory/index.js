const { rejects } = require('assert');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const destDir = path.join(__dirname, 'files-copy');
const sourceDir = path.join(__dirname, 'files');

function createDir(dir) {
fs.mkdir(dir, { recursive: true }, (err) => {
  if (err) {
    console.log(err);
  }
});
}

async function isSameFiles() {
  try {
    const sourceFiles = await fsPromises.readdir(sourceDir);
    const destFiles = await fsPromises.readdir(destDir);
    destFiles.forEach((file) => {
      if (!sourceFiles.includes(file)) {
        fs.unlink(path.join(destDir, file), (err) => {
          console.log(err);
        })
      }
    })
  }
  catch (err) {
    console.log(err);
  }
};

fs.access(destDir, err => {
  if (err) {
    if (err.code === 'ENOENT') {
      createDir(destDir);
    }
  } else {
    isSameFiles();
  }
});

fs.readdir(sourceDir, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      fs.copyFile(
        path.join(__dirname, 'files', `${file.name}`),
        path.join(__dirname, 'files-copy', `${file.name}`),
        (err) => {
          if (err) console.log(err);
        },
      );
    });
  }
});

