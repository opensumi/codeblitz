const semver = require('semver');
const chalk = require('chalk');

exports.SEMVER_INC = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];

exports.getNewVersion = (oldVersion, inc) => {
  const newVersion = semver.inc(oldVersion, inc);

  const output = [];
  for (let i = 0; i < newVersion.length; i++) {
    if (newVersion[i] === oldVersion[i]) {
      output.push(newVersion[i]);
    } else {
      output.push(chalk.green(newVersion[i]));
    }
  }
  return { version: newVersion, text: output.join('') };
};

exports.isValidVersion = (input) => Boolean(semver.valid(input));

exports.isVersionGreat = (newVersion, oldVersion) => semver.gt(newVersion, oldVersion);
