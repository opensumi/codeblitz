import program, { Option } from 'commander';
import { install, uninstall, installLocalExtensions } from './extension';
import { log } from './util/log';

program.version(`alex ${require('../package').version}`).usage('<command> [options]');

const extensionProgram = program
  .command('extension')
  .alias('ext')
  .description(
    `
install opensumi extensions, you should config in package.json firstly, example:
{
  "cloudideExtensions": {
    "publisher": "kaitian",
    "name": "ide-dark-theme",
    "version": "2.0.0"
  }
}
version can be ignored, then will use latest version under current opensumi framework version
`
  )
  .action((__, command) => {
    if (command.args.length) {
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
  .addOption(new Option('-m, --mode [type]', 'extension env mode').choices(['internal', 'public']))
  .description(
    'install single or multiple extension, eg. kaitian.ide-dark-theme, kaitian.ide-dark-theme@2.0.0'
  )
  .action((extensions: string[], options) => {
    install(extensions, options).catch((err) => console.error(err));
  });

extensionProgram
  .command('uninstall <extensions...>')
  .description('uninstall single or multiple extension, eg. kaitian.ide-dark-theme')
  .action((extensions) => {
    uninstall(extensions).catch((err) => console.error(err));
  });

extensionProgram
  .command('link <extensionDirs...>')
  .description('link local extension for dev')
  .option('-h, --host [value]', 'local extension static file service host, default: `localhost`')
  .action((extensionDirs, options) => {
    installLocalExtensions(extensionDirs, options).catch((err) => console.error(err));
  });

program.parse(process.argv);
