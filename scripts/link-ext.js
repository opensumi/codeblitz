const path = require('path');
const { exec } = require('./utils/utils');
const target = process.argv[2];

exec(`ln -s ${target}`, {
  cwd: path.join(__dirname, '../packages/toolkit/extensions'),
});
