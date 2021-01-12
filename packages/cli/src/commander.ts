import program from 'commander';
import { install, uninstall } from './extension';
import { log } from './util/log';

program.version(`alex ${require('../package').version}`).usage('<command> [options]');

const extensionProgram = program
  .command('extension')
  .alias('ext')
  .description(
    `
install kaitian extensions, you should config in package.json firstly, example:
{
  "kaitianExtensions": {
    "publisher": "kaitian",
    "name": "ide-dark-theme",
    "version": "2.0.0"
  }
}
version can be ignored, then will use latest version under current kaitian framework version
`
  )
  .action((cmd, ...args) => {
    if (args.length) {
      log.warn(
        'You provided more than one argument. if you want to install extensions, you should use install command'
      );
      return;
    }
    install().catch((err) => console.error(err));
  });

extensionProgram
  .command('install <extensions...>')
  .alias('i')
  .description(
    'install single or multiple extension, eg. kaitian.ide-dark-theme, kaitian.ide-dark-theme@2.0.0'
  )
  .action((extensions: string[]) => {
    install(extensions).catch((err) => console.error(err));
  });

extensionProgram
  .command('uninstall <extensions...>')
  .description('uninstall single or multiple extension, eg. kaitian.ide-dark-theme')
  .action((extensions) => {
    uninstall(extensions).catch((err) => console.error(err));
  });

program.parse(process.argv);
