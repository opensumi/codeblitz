const Basement = require('@alipay/basement');
const urllib = require('urllib');
const path = require('path');
const chalk = require('chalk');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const options = {
  // 从 cloud-ide 获取 appId 和 masterKey:
  // https://basement.alipay.com/doc/detail/ziarab#da1386cd
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  urllib,
  endpoint: 'https://basement-gzone.alipay.com',
};

exports.uploadFile = async (filepath, filename) => {
  if (!options.appId || !options.masterKey) {
    throw new Error(chalk.red('请配置文件服务 Access Key'));
  }

  const basement = new Basement(options);
  if (!filename) {
    filename = path.basename(filepath);
  }
  const res = await basement.file.upload(filename, filepath);
  console.log('>>>>>>>>>> INTERNAL >>>>>>>>>>');
  console.log(res);
  console.log('<<<<<<<<<< INTERNAL <<<<<<<<<<');
  return res;
};

exports.upload = async (manifest) => {
  const result = {};
  for (const key of Object.keys(manifest)) {
    const { filepath, filename } = manifest[key];
    const res = await this.uploadFile(filepath, filename);
    result[key] = res.url;
  }
  return result;
};
