const path = require('path');
const { readdir, stat } = require('fs/promises');

readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }).then(
  (res) => {
    for (let el of res) {
      stat(path.join(__dirname, 'secret-folder', el.name)).then((item) => {
        if (el.isFile())
          console.log(
            `${path.basename(el.name, path.extname(el.name))} - ${path
              .extname(el.name)
              .slice(1)} - ${Math.trunc(item.size / 1000) + ((item.size % 1000) ? 1 : 0)}kb`
          );
      });
    }
  }
);
