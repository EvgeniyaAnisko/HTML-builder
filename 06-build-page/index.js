const path = require('path');
const fs = require('fs');

const { mkdir, readdir, copyFile, readFile} = require('fs/promises');

async function createElementThree(){

  await mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  await mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });

  copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'));

  await readdir(path.join(__dirname, 'assets'), { withFileTypes: false }).then(
    (res) => {
      for (let el of res) {
        mkdir(path.join(__dirname, 'project-dist', 'assets', el), {recursive: true});
        readdir(path.join(__dirname, 'assets', el), {withFileTypes: true}).then(res => {
          for (let item of res)
            copyFile(path.join(__dirname, 'assets', el, item.name), path.join(__dirname, 'project-dist', 'assets', el, item.name));  
        });
      }
    }
  );
}

async function mergeStyles () {
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
}



async function readHtml() {
  const readTemplate = await readFile(path.join(__dirname, 'template.html'), 'utf-8');
  let str = '';
  str += readTemplate;
  const readComponents = await readdir(path.join(__dirname, 'components'), {withFileTypes: true});
  for(let el of readComponents){

    if(el.isFile() && path.extname(el.name) === '.html'){
      if(str.includes(`{{${path.basename(el.name, path.extname(el.name))}}}`)){
        const readHtml = await readFile(path.join(__dirname, 'components', el.name), 'utf-8');
        str = str.replace(`{{${path.basename(el.name, path.extname(el.name))}}}`, readHtml);
      }
    }
  }
  const indexWrite = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  indexWrite.write(str);
}

async function build(){
  await createElementThree();
  await readHtml();
  await mergeStyles();
}

build();