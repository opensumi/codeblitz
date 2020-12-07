const Basement = require('@alipay/basement');
const urllib = require('urllib');

const basement = new Basement({
  // 从 cloud-ide 获取 appId 和 masterKey:
  // https://basement.alipay.com/doc/detail/ziarab#da1386cd
  appId: '5cc2accfd778edcdb666b983',
  masterKey: '9db6Pzf0VtsRQOE-8nGzOt2x',
  urllib,
  endpoint: 'https://basement-gzone.alipay.com',
});

exports.updateFile = async (filename, file) => {
  const res = await basement.file.upload(file, file);
  return res;
};
