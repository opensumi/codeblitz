const fse = require('fs-extra');
const path = require('path');

const lib = 'require("../bundle")';

exports.generateLanguages = async () => {
  const languagesDir = path.join(
    __dirname,
    '../../node_modules/@ali/kaitian-textmate-languages/lib'
  );
  const targetDir = path.join(__dirname, '../../packages/alex/languages');
  await fse.remove(targetDir);
  await fse.ensureDir(targetDir);
  fse
    .readdirSync(languagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .forEach((lang) => {
      fse.writeFileSync(
        path.join(targetDir, `${lang}.js`),
        `
const { registerLanguage, registerGrammar } = ${lib};
const loadLanguage = require('@ali/kaitian-textmate-languages/lib/${lang}');
loadLanguage(registerLanguage, registerGrammar);
        `.trim() + '\n'
      );
    });
};

exports.generateModules = async () => {
  const modulesDir = path.join(__dirname, '../../packages/alex/src/modules');
  const targetDir = path.join(__dirname, '../../packages/alex/modules');
  await fse.remove(targetDir);
  await fse.ensureDir(targetDir);
  fse.readdirSync(modulesDir).forEach((mod) => {
    const [scope, name] = path.basename(mod, '.ts').split('__');
    fse.writeFileSync(
      path.join(targetDir, `${name}.js`),
      `
const { requireModule } = ${lib};
module.exports = requireModule("@${scope}/${name}");
        `.trim() + '\n'
    );
    fse.writeFileSync(
      path.join(targetDir, `${name}.d.ts`),
      `
export * from "../lib/modules/${scope}__${name}";
        `.trim() + '\n'
    );
  });
};

exports.generateShims = async () => {
  const polyfillsDir = path.join(__dirname, '../../packages/alex/polyfills');
  await fse.remove(polyfillsDir);
  await fse.ensureDir(polyfillsDir);
  await fse.copy(path.join(__dirname, '../../packages/toolkit/polyfill'), polyfillsDir);

  const shimsDir = path.join(__dirname, '../../packages/alex/shims');
  await fse.remove(shimsDir);
  await fse.ensureDir(shimsDir);
  ['fs', 'fs-extra', 'os', 'crypto', 'buffer', 'process', 'assert', 'path'].forEach((mod) => {
    fse.writeFileSync(
      path.join(shimsDir, `${mod}.js`),
      `
const { requireModule } = ${lib};
module.exports = requireModule("${mod}");
    `.trim() + '\n'
    );
  });
};

exports.generateAll = () => {
  return Promise.all([
    exports.generateLanguages(),
    exports.generateModules(),
    exports.generateShims(),
  ]);
};
