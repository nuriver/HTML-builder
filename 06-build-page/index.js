const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const newFolderPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const compileStyles = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'style.css'),
);
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
async function stylesCompiler() {
  const stylesArr = await fsPromises.readdir(stylesPath, { withFileTypes: true });
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
        cssDataArr.forEach((data) => compileStyles.write(`${data}\n`));
      }
      counter += 1;
    })
  })
}
stylesCompiler();

// Template tags replacing in index.html
async function htmlTagsReplacer() {
  const componentsArr = (await fsPromises.readdir(componentsPath, { withFileTypes: true })).filter((file) => path.extname(file.name) === '.html' && file.isFile());

  templateReading.on('data', (data) => {
    let templateData = data.toString();
    let counter = 1;

    componentsArr.forEach((file) => {
    let trimedName = file.name.replace(path.extname(file.name), '');
    let componentsReadStream = fs.createReadStream(
    path.join(componentsPath, `${file.name}`),
    );
    componentsReadStream.on('data', (data) => {
      let indexData = templateData.replace(`{{${trimedName}}}`, `${data.toString()}`)
      templateData = indexData;
      if (counter >= componentsArr.length) {
        indexWriting.write(indexData);
      }
      counter += 1;
    })
  })
  })
}
htmlTagsReplacer()

// Copy assets folder
const sourceAssets = path.join(__dirname, 'assets');
const destAssets = path.join(newFolderPath, 'assets');

function createDir(dir) {
fs.mkdir(dir, { recursive: true }, (err) => {
  if (err) {
    console.log(err);
  }
});
}

async function isSameFiles(sourcePath, destPath) {
  try {
    const sourceFiles = await fsPromises.readdir(sourcePath);
    const destFiles = await fsPromises.readdir(destPath);
    destFiles.forEach((file) => {
      if (!sourceFiles.includes(file)) {
        fs.unlink(path.join(destPath, file), (err) => {
          console.log(err);
        })
      }
    })
  }
  catch (err) {
    console.log(err);
  }
};

function copyDir(sourcePath, destPath) {
  fs.access(destPath, err => {
  if (err) {
    if (err.code === 'ENOENT') {
      createDir(destPath);
    }
  } else {
    isSameFiles(sourcePath, destPath);
  }
});

  fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        fs.copyFile(
          path.join(sourcePath, `${file.name}`),
          path.join(destPath, `${file.name}`),
          (err) => {
            if (err) console.log(err);
          },
        );
      });
    }
  });
}

createDir(destAssets);

const fontsSource = path.join(sourceAssets, 'fonts');
const fontsDist = path.join(destAssets, 'fonts');
copyDir(fontsSource, fontsDist);

const imgSource = path.join(sourceAssets, 'img');
const imgDist = path.join(destAssets, 'img');
copyDir(imgSource, imgDist);

const svgSource = path.join(sourceAssets, 'svg');
const svgDist = path.join(destAssets, 'svg');
copyDir(svgSource, svgDist);
