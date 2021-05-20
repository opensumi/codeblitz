const { commands, workspace } = require('vscode');
const log = (scope, ...msg) => console.log(`>>>[worker-example][${scope}]`, ...msg);

/** @type {import('vscode').ExtensionContext} */
let context;

exports.activate = async (ctx) => {
  context = ctx;

  log('start');

  commands.registerCommand('plugin.command.test', async () => {
    commands.registerCommand('plugin.command.say', (msg) => {
      log('plugin', msg);
    });
    log('plugin', await commands.executeCommand('plugin.command.add', 1));
  });

  // 这里时序似乎有问题，command 是在 onStart 时注册的
  // 而如果插件 activateEvents 为 *，那么有可能在 commands 注册之前激活
  // 可能需要在 kaitian 中把插件的激活时机调整到 onStart，或者 alex 后续将 extension 模块异步加载可解
  // lsif();

  context.workspaceState.update('worker-example-workspace-state', 'alex is great');
  context.globalState.update('worker-example-global-state', 'alex is great');

  commands.registerCommand('alex.settings', () => {
    workspace.getConfiguration().update('editor.fontSize', 16, true);
    workspace.getConfiguration().update('editor.tabSize', 8, true);
    workspace.getConfiguration().update('general.theme', 'ide-dark', true);
  });
};

async function lsif() {
  const data = await commands.executeCommand('alex.codeServiceProject');
  log('codeServiceProject', data);

  const ticket = await commands.executeCommand('alex.subscribe');
  commands.registerCommand(`alex.subscribe:${ticket}`, (type, data) => {
    log('subscribe', type, data);
  });
}
