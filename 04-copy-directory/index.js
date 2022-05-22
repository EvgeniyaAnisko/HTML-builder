const path = require('path');
const { copyFile, mkdir, readdir, unlink } = require('fs/promises');

mkdir(path.join(__dirname, 'copy'), {recursive: true});

readdir(path.join(__dirname, 'copy'), {withFileTypes: true}).then(res => {
  for (let item of res)
    unlink(path.join(__dirname, 'copy', item.name));
});

readdir(path.join(__dirname, 'files'), {withFileTypes: true}).then(res => {
  for (let item of res)
    copyFile(path.join(__dirname, 'files', item.name), path.join(__dirname, 'copy', item.name));  
});