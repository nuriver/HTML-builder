const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const bundle = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);
const sourceFolder = path.join(__dirname, 'styles');

async function makeBundle() {
  const stylesArr = await fsPromises.readdir(sourceFolder, { withFileTypes: true });
  const trueCssArr = stylesArr.filter((file) => 
    path.extname(file.name) === '.css' && file.isFile());
  const cssDataArr = [];
  let counter = 1;
  trueCssArr.forEach((file) => {
    const readStream = fs.createReadStream(
    path.join(__dirname, 'styles', `${file.name}`),
    ); 
    readStream.on('data', (data) => {
      cssDataArr.push(data);
      if (counter >= trueCssArr.length) {
        cssDataArr.forEach((data) => bundle.write(`${data}\n`));
      }
      counter += 1;
    })    
  })
}
makeBundle();