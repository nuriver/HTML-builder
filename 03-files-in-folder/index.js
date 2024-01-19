const fs = require("fs");
const path = require("path");
const pathToFolder = path.join(__dirname, "secret-folder");

fs.readdir(pathToFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err)
  } else {
    files.forEach(file => {
      if (file.isFile()) {
        let filePath = path.join(__dirname, "secret-folder", file.name);
        fs.stat(`${filePath}`, (err, stats) => {
          if (err) console.log(err);
          let trimedName = file.name.replace(path.extname(file.name), '');
          let size = `${stats.size}bytes`;
          let fileType = (path.extname(file.name)).replace(".", "");
            console.log(`${trimedName}-${fileType}-${size}`);
        })
      }
    })
  };
});