const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

/**
 * 
 * manifest: { webview: { filepath: xxxx } }
 * return: {webview: 'https://xxx'}
 * @param {Record<string, {filepath: string; filename: string}>} manifest 
 * @returns {Record<string, string>}
 */
exports.upload = async (manifest) => {
  const result = await require('./_upload').upload(manifest);
  return result;
};
