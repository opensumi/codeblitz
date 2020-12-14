const vscode = require('vscode');

const log = (...msg) => console.log('>>>[worker-example]', ...msg);

exports.activate = async (context) => {
  log('context.asAbsolutePath', context.asAbsolutePath('./abc'));
  log('context.extensionPath', context.extensionPath);
  // log('context.asHref', await context.asHref('./abc'))
};
