import program from 'commander'
import { install, uninstall } from './extension'

program.version(`spacex ${require('../package').version}`).usage('<command> [options]')

const extensionProgram = program
  .command('extension')
  .alias('ext')
  .description('install/uninstall kaitian extension')
  .action(() => {
    install().catch((err) => console.error(err))
  })

extensionProgram
  .command('install')
  .alias('i')
  .description(
    `
install kaitian extension, you should config in package.json firstly, example:
{
  "kaitianExtensions": {
    "publisher": "kaitian",
    "name": "ide-dark-theme",
    "version": "2.0.0"
  }
}
`
  )
  .action(() => {
    install().catch((err) => console.error(err))
  })

extensionProgram
  .command('uninstall <extensions...>')
  .description('uninstall kaitian extensions')
  .action((extensions) => {
    uninstall(extensions).catch((err) => console.error(err))
  })

program.parse(process.argv)
