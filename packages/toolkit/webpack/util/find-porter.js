/**
 * link https://joecreager.com/5-reasons-to-avoid-deasync-for-node-js/
 */

const { execSync } = require('child_process');
const portfinder = require('portfinder');

exports.findPort = async (basePort, child = false) => {
  try {
    const port = await portfinder.getPortPromise({ port: basePort });
    if (child) {
      process.stdout.write(String(port));
    } else {
      return port;
    }
  } catch (err) {
    if (child) {
      process.stdout.write('-1');
    } else {
      throw err;
    }
  }
};

exports.findPortSync = (basePort) => {
  const port = execSync(`node -e "require('${__filename}').findPort(${basePort}, true)"`, {
    encoding: 'utf-8',
  });
  if (port === '-1') {
    throw new Error('find port error');
  }
  return Number(port);
};
