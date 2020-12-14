const execa = require('execa');
const invoke = require('./utils/invoke');

invoke(async () => {
  await execa.command('npx webpack --config webpack/config.worker.js', {
    env: {
      IS_DEV: process.env.IS_DEV == '1',
    },
    cwd: './packages/toolkit',
  });
});
