const vscode = require('vscode');

const log = (...msg) => console.log('>>>[worker-example]', ...msg);

exports.activate = async (context) => {
  console.log(context);
  // log('context.extensionUri', context.extensionUri.toString());
  // log('context.extensionPath', context.extensionPath);
};
