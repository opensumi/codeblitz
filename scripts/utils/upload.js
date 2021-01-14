const Basement = require('@alipay/basement');
const urllib = require('urllib');
const path = require('path');

const basement = new Basement({
  // 从 cloud-ide 获取 appId 和 masterKey:
  // https://basement.alipay.com/doc/detail/ziarab#da1386cd
  appId: '5ffe6c675c2b90057b69a6b8',
  masterKey: 'y7AFt54xQ2Z4PJuzF4kDF9Gj',
  urllib,
  endpoint: 'https://basement-gzone.alipay.com',
});

exports.uploadFile = async (filepath, filename) => {
  if (!filename) {
    filename = path.basename(filepath);
  }
  const options = {};
  if (path.extname(filename) === '.html') {
    options.headers = {
      cacheControl: 'max-age=0, s-maxage=120, must-revalidate',
    };
  }
  const res = await basement.file.upload(filename, filepath, options);
  console.log('========== INTERNAL ==========');
  console.log(res);
  console.log('========== INTERNAL ==========');
  return res;
};

exports.upload = async (manifest) => {
  const result = {};
  for (const key of Object.keys(manifest)) {
    const res = await this.uploadFile(manifest[key], key);
    result[key] = res.url;
  }
  return result;
};
