const { commands } = require('vscode');

const log = (...msg) => console.log('>>>[worker-example]', ...msg);

exports.activate = async (context) => {
  const data = await commands.executeCommand('alex.codeServiceProject');
  log('>>>codeServiceProject', data);

  const ticket = await commands.executeCommand('alex.subscribe');
  commands.registerCommand(`alex.subscribe:${ticket}`, (type, data) => {
    log('>>>subscribe', type, data);
  });
};
