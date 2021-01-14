const execa = require('execa');

exports.invoke = async (fn) => {
  try {
    await fn();
  } catch (err) {
    console.error(err);
    process.exit(128);
  }
};

exports.exec = async (command, options, silent = false) => {
  try {
    await execa.command(command, {
      stdio: 'inherit',
      ...options,
    });
  } catch (err) {
    if (!silent) {
      throw err;
    }
  }
};
