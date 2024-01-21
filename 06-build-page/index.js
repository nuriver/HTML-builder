const fs = require('fs');
const path = require('path');
const newFolderPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const compileStyles = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'styles.css'),
);
const stylesArr = [];
const templateReading = fs.createReadStream(
  path.join(__dirname, 'template.html'),
);
const indexWriting = fs.createWriteStream(
  path.join(newFolderPath, 'index.html'),
);

// Create project-dist folder
fs.mkdir(newFolderPath, { recursive: true }, (err) => {
  if (err) {
    console.log(err);
  }
});

// Styles compilation
fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    let counter = 1;
    const trueCssArr = files.filter(
      (file) => path.extname(file.name) === '.css' && file.isFile(),
    );
    trueCssArr.forEach((file) => {
      const readStream = fs.createReadStream(
        path.join(__dirname, 'styles', `${file.name}`),
      );
      readStream.on('data', (data) => {
        stylesArr.push(data);
        if (counter >= trueCssArr.length) {
          stylesArr.forEach((data) => compileStyles.write(data));
        }
        counter += 1;
      });
    });
  }
});

// Template tags replacing in index.html
fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    // Get data from template.html
    templateReading.on('data', (data) => {
      let templateData = data.toString();

      //Get data from  each of html in components
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let trimedName = file.name.replace(path.extname(file.name), '');
        if (
          path.extname(file.name) === '.html' &&
          file.isFile() &&
          i < files.length
        ) {
          let componentReadStream = fs.createReadStream(
            path.join(componentsPath, `${file.name}`),
          );
          componentReadStream.on('data', (data) => {
            //Replace template tag with data from corresponding html component
            let indexData = templateData.replace(
              `{{${trimedName}}}`,
              data.toString(),
            );
            templateData = indexData;

            // When all tags are replaced place assambled data to index.html
            if (i === files.length - 1) {
              indexWriting.write(indexData);
            }
          });
        }
      }
    });
  }
});

// Copy assets folder
const sourceAssets = path.join(__dirname, 'assets');
const distAssets = path.join(newFolderPath, 'assets');

// Create assets folder in project-dist folder
fs.mkdir(distAssets, { recursive: true }, (err) => {
  if (err) {
    console.log(err);
  }
});

function copyDir(sourcePath, distPath) {
  fs.mkdir(distPath, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        fs.copyFile(
          path.join(sourcePath, `${file.name}`),
          path.join(distPath, `${file.name}`),
          (err) => {
            if (err) console.log(err);
          },
        );
      });
    }
  });
}

const fontsSource = path.join(sourceAssets, 'fonts');
const fontsDist = path.join(distAssets, 'fonts');
copyDir(fontsSource, fontsDist);

const imgSource = path.join(sourceAssets, 'img');
const imgDist = path.join(distAssets, 'img');
copyDir(imgSource, imgDist);

const svgSource = path.join(sourceAssets, 'svg');
const svgDist = path.join(distAssets, 'svg');
copyDir(svgSource, svgDist);
