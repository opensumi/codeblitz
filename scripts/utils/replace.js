/**
 * 类似 @rollup/plugin-replace，用于 tsc 阶段替换 env
 */

const fse = require('fs-extra');
const path = require('path');

/**
 * @param {string[]} files
 * @param {Record<string, string>} replacement
 */
exports.replace = (files, replacement) => {
  const keys = Object.keys(replacement)
    .sort((a, b) => b.length - a.length)
    .map((str) => str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'));
  const pattern = new RegExp(`\\b(${keys.join('|')})\\b`, 'g');

  return Promise.all(
    files.map(async (file) => {
      let code = await fse.readFile(file, 'utf8');
      let result = false;
      code = code.replace(pattern, (match) => {
        result = true;
        return JSON.stringify(replacement[match]);
      });

      if (result) {
        await fse.writeFile(file, code);
      }
    })
  );
};

exports.replaceWorkerAndWebviewAssets = async () => {
  const configPath = path.resolve(__dirname, '..', '..', 'packages/toolkit/define.json');
  if (!fse.existsSync(configPath)) {
    throw new Error('请先运行 build-assets 构建资源');
  }

  const targetFiles = [
    path.resolve(__dirname, '..', '..', 'packages/alex/lib/api/createApp.js'),
    path.resolve(__dirname, '..', '..', 'packages/alex/lib/api/createEditor.js'),
  ];

  if (!targetFiles.every((file) => fse.existsSync(file))) {
    throw new Error('请先运行 build 构建 lib');
  }

  return exports.replace(targetFiles, await fse.readJSON(configPath));
};
