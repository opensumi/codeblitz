// https://code.alipay.com/A-team/e2/blob/master/scripts/antlr.js
const path = require('path');
const { exec } = require('shelljs');
const rimraf = require('rimraf');
const glob = require('glob');

const antlr4 = `java -jar "${path.resolve('scripts/utils/antlr-4.7.2-complete.jar')}"`;

glob('packages/sql-service/**/*.g4', (er, files) => {
  if (er) {
    console.error('glob g4 file error');
    return;
  }
  files.forEach((file) => {
    const filePath = path.resolve(file);
    const outputPath = path.resolve(path.dirname(filePath), 'generated-parser');
    rimraf(outputPath, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      if (filePath.includes('/lib/')) {
        // 去除已打包的目录
        return;
      }
      console.log(`find file: ${filePath}`);
      console.log('start generating parser');
      exec(
        `${antlr4} -Dlanguage=JavaScript -visitor ${filePath} -o ${outputPath} -Xexact-output-dir -long-messages`,
        // `antlr4ts -visitor ${filePath}`,
        (error) => {
          if (error) {
            console.log(error);
            return;
          }
          console.log(`end generating parser`);
        },
      );
    });
  });
});
