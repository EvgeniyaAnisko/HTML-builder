const path = require('path');
const { copyFile, mkdir, readdir, unlink } = require('fs/promises');

mkdir(path.join(__dirname, 'files-copy'), {recursive: true});

readdir(path.join(__dirname, 'files-copy'), {withFileTypes: true}).then(res => {
  for (let item of res)
    unlink(path.join(__dirname, 'files-copy', item.name));
});

readdir(path.join(__dirname, 'files'), {withFileTypes: true}).then(res => {
  for (let item of res)
    copyFile(path.join(__dirname, 'files', item.name), path.join(__dirname, 'files-copy', item.name));  
});