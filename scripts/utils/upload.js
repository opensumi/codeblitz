const Basement = require('@alipay/basement');
const urllib = require('urllib');
const path = require('path');

const basement = new Basement({
  // 从 cloud-ide 获取 appId 和 masterKey:
  // https://basement.alipay.com/doc/detail/ziarab#da1386cd
  appId: '6039249f8ee5e40583902ff7',
  masterKey: 'aaItsFwEiBDX_WgXM5DDmcA4',
  urllib,
  endpoint: 'https://basement-gzone.alipay.com',
});

exports.uploadFile = async (filepath, filename) => {
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
