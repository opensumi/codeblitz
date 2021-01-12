const fs = require('fs');
const path = require('path');

if (fs.existsSync(path.join(__dirname, '.no-postinstall'))) {
  return;
}

require('@alipay/alex-cli/lib/extension')
  .install([], { silent: true })
  .catch((err) => console.error(err));
