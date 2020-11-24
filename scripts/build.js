const path = require('path')
const signale = require('signale')
const execa = require('execa')
const args = require('minimist')(process.argv.slice(2))

run()

async function run() {
  signale.pending('开始编译 ts 文件')
  const tsconfigPath = path.join(__dirname, '../packages', args.scope || '', 'tsconfig.build.json')
  try {
    const watch = args.w || args.watch ? '--watch' : ''
    await execa('tsc', ['-b', tsconfigPath, watch, '--locale', 'zh-cn'], {
      stdio: 'inherit', // use inherit get pretty error log
    })
    signale.success('编译成功')
  } catch (err) {
    signale.error('编译失败')
  }
}
