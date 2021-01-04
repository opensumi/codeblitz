const fse = require('fs-extra');
const path = require('path');

export const parse = async (file) => {
  const content = await fse.readFile(path.resolve(process.cwd(), file), 'utf8');
  const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
  const NEWLINES_MATCH = /\n|\r|\r\n/;

  const obj = {};
  content.split(NEWLINES_MATCH).forEach((line) => {
    const keyValue = line.match(RE_INI_KEY_VAL);
    if (keyValue !== null) {
      const key = keyValue[1];
      let value = keyValue[2];
      const end = value.length - 1;
      if ((value[0] === '"' && value[end] === '"') || (value[0] === "'" && value[end] === "'")) {
        value = value.slice(1, end);
      } else {
        value = value.trim();
      }
      obj[key] = value;
    }
  });
  console.log(`env: ${JSON.stringify(obj)}`);
  return obj;
};
