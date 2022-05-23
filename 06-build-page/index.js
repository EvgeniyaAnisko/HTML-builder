const path = require('path');
const fs = require('fs');

const { mkdir, readdir, copyFile, unlink } = require('fs').promises;

mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });

readdir(path.join(__dirname, 'assets'), { withFileTypes: false }).then(
  (res) => {
    for (let el of res) {
      mkdir(path.join(__dirname, 'project-dist', 'assets', el), {recursive: true});
      readdir(path.join(__dirname, 'project-dist', 'assets', el), {withFileTypes: true}).then(res => {
        for (let item of res)
          unlink(path.join(__dirname, 'project-dist', 'assets', el, item.name));
      });
      
      readdir(path.join(__dirname, 'assets', el), {withFileTypes: true}).then(res => {
        for (let item of res)
          copyFile(path.join(__dirname, 'assets', el, item.name), path.join(__dirname, 'project-dist', 'assets', el, item.name));  
      });
    }
  }
);

copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'));

const writableStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'style.css')
);
fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, res) => {
    for (let item of res)
      if (path.extname(item.name) === '.css') {
        const readableStream = fs.createReadStream(
          path.join(__dirname, 'styles', item.name),
          'utf-8'
        );
        readableStream.on('data', (chunk) => writableStream.write(chunk));
      }
  }
);
