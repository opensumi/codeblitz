const chalk = require('chalk')

if (!/yarn\.js$/.test(process.env.npm_execpath || '')) {
  console.warn(chalk.yellow('⚠ 需要使用 Yarn >= 1.x 以支持 Workspaces\n'))
  process.exit(1)
}
