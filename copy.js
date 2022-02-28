const fs = require('fs');
const Path = require('path');

const path = Path.join(__dirname, '/packages/alex/src/modules');

const modules = fs.stat(path, (err, stats) => {
  if (err) {
    console.log(err);
    return;
  }
  if (stats.isDirectory) {
    const files = fs.readdirSync(path);
    console.log(files);
    files.forEach((file) => {
      fs.copyFileSync(Path.join(path, file), Path.join(path, file.replace('ali__', 'opensumi__')));
    });
  }
});
