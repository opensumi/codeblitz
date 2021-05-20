const path = require('path');
const fse = require('fs-extra');
const { exec } = require('./utils/utils');
const target = process.argv[2];

const cwd = path.join(__dirname, '../packages/toolkit/extensions');

fse.ensureDirSync(cwd);

exec(`ln -s ${target}`, { cwd });
