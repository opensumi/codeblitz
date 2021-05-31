const signale = require('signale');
const { invoke, exec } = require('./utils/utils');
const { generateLanguages, generateModules, generateShims } = require('./utils/generate-alias');

invoke(async () => {
  await Promise.all([generateLanguages(), generateModules(), generateShims()]);

  // try {
  //   await exec('yarn workspace @alipay/alex-toolkit build:languages');
  // } catch (err) {
  //   signale.error('build languages 失败')
  //   throw err
  // }
});
