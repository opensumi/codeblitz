const path = require('path');
const { ExtensionScanner } = require('@ali/ide-kaitian-extension/lib/node/extension.scanner');

module.exports = () => {
  const extensionScanner = new ExtensionScanner(
    [path.join(__dirname, '../../extensions'), path.join(__dirname, '../../fixtures')],
    'en-US',
    [],
    {}
  );
  return extensionScanner.run();
};
