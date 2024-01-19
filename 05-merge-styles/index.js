const fs = require("fs");
const path = require("path");
const bundle = fs.createWriteStream(path.join(__dirname, "project-dist", "bundle.css"));
const sourceFolder = path.join(__dirname, "styles");
const dataArr = [];

fs.readdir(sourceFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (path.extname(file.name) === ".css" && file.isFile()) {
        const readStream = fs.createReadStream(path.join(__dirname, "styles", `${file.name}`));
        readStream.on("data", (data) => {
          dataArr.push(data);
          dataArr.forEach((data) => bundle.write(data));
})
      }
    })
  }
});