const { commands } = require('vscode');
const log = (scope, ...msg) => console.log(`[worker-example][${scope}]`, ...msg);

/** @type {import('vscode').ExtensionContext} */
let context;

exports.activate = async (ctx) => {
  context = ctx;

  lsif();

  context.workspaceState.update('worker-example-workspace-state', 'alex is great');
  context.globalState.update('worker-example-global-state', 'alex is great');
};

async function lsif() {
  const data = await commands.executeCommand('alex.codeServiceProject');
  log('codeServiceProject', data);

  const ticket = await commands.executeCommand('alex.subscribe');
  commands.registerCommand(`alex.subscribe:${ticket}`, (type, data) => {
    log('subscribe', type, data);
  });
}
