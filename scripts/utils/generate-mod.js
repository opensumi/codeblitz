const fse = require('fs-extra');
const path = require('path');

exports.generateLanguages = async () => {
  const languagesDir = path.join(
    __dirname,
    '../../node_modules/@ali/kaitian-textmate-languages/lib'
  );
  const languagesList = fse
    .readdirSync(languagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const targetDir = path.join(__dirname, '../../packages/alex/languages');
  await fse.remove(targetDir);
  await fse.ensureDir(targetDir);
  languagesList.forEach((lang) => {
    fse.writeFileSync(
      path.join(targetDir, `${lang}.js`),
      `
const { registerLanguage, registerGrammar } = require('..');
const loadLanguage = require('@ali/kaitian-textmate-languages/lib/${lang}');
loadLanguage(registerLanguage, registerGrammar);
    `.trim() + '\n'
    );
  });
};

exports.generateLanguages();
