const { invoke } = require('./utils/utils');
const { generateLanguages, generateModules, generateShims } = require('./utils/generate-alias');

invoke(() => Promise.all([generateLanguages(), generateModules(), generateShims()]));
