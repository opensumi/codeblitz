const fse = require('fs-extra');
const path = require('path');

const lib = 'require("../bundle")';

exports.generateLanguages = async () => {
  const languagesDir = path.join(
    __dirname,
    '../../node_modules/@opensumi/textmate-languages/lib'
  );
  const targetDir = path.join(__dirname, '../../packages/core/languages');
  await fse.remove(targetDir);
  await fse.ensureDir(targetDir);

  let langEntryContent = '';
  let declarationContent = `declare module '@codeblitzjs/ide-core/languages' {}\n`;

  fse
    .readdirSync(languagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .forEach((lang) => {
      fse.writeFileSync(
        path.join(targetDir, `${lang}.js`),
        `
const { Registry } = require('@codeblitzjs/ide-registry');
const loadLanguage = require('@opensumi/textmate-languages/lib/${lang}');
const registerLanguage = (contrib) => Registry.register('language', contrib);
const registerGrammar = (contrib) => Registry.register('grammar', contrib);
loadLanguage(registerLanguage, registerGrammar);
        `.trim() + '\n'
      );

      langEntryContent += `require('./${lang}')\n`;
      declarationContent += `declare module '@codeblitzjs/ide-core/languages/${lang}' {}\n`;
    });

  fse.writeFileSync(path.join(targetDir, 'index.js'), langEntryContent);
  const declarationFile = path.join(__dirname, '../../packages/core/typings/languages.d.ts');
  fse.writeFileSync(declarationFile, declarationContent);
};

exports.generateModules = async () => {
  const modulesDir = path.join(__dirname, '../../packages/core/src/modules');
  const targetDir = path.join(__dirname, '../../packages/core/modules');
  await fse.remove(targetDir);
  await fse.ensureDir(targetDir);


  fse.readdirSync(modulesDir).forEach((mod) => {
    const [scope, name] = path.basename(mod, '.ts').split('__');

    if (name === 'common-di') {
      writeModule(scope, 'di', 'common-di');
    } else {
      writeModule(scope, name, name);
    }
  });


  function writeModule(scope, packageName, fileName) {
    fse.writeFileSync(
      path.join(targetDir, `${fileName}.js`),
      `
const { requireModule } = ${lib};
module.exports = requireModule("@${scope}/${packageName}");
        `.trim() + '\n'
    );
    fse.writeFileSync(
      path.join(targetDir, `${fileName}.d.ts`),
      `
export * from "../lib/modules/${scope}__${packageName}";
        `.trim() + '\n'
    );
  }
};

exports.generateShims = async () => {
  const polyfillsDir = path.join(__dirname, '../../packages/core/polyfills');
  await fse.remove(polyfillsDir);
  await fse.ensureDir(polyfillsDir);
  await fse.copy(path.join(__dirname, '../../packages/toolkit/polyfill'), polyfillsDir);

  const shimsDir = path.join(__dirname, '../../packages/core/shims');
  await fse.remove(shimsDir);
  await fse.ensureDir(shimsDir);
  ['fs', 'fs-extra', 'os', 'crypto', 'buffer', 'process', 'assert', 'path'].forEach((id) => {
    fse.writeFileSync(
      path.join(shimsDir, `${id}.js`),
      `
const { requireModule } = ${lib};
module.exports = requireModule("${id}");
    `.trim() + '\n'
    );
  });
};
