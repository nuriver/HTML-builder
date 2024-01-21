const fs = require('fs');
const path = require('path');
const destDir = path.join(__dirname, 'files-copy');
const sourceDir = path.join(__dirname, 'files');

fs.mkdir(destDir, { recursive: true }, (err) => {
  if (err) {
    console.log(err);
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
