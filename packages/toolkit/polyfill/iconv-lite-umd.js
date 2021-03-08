/**
 * editor 场景直接用 utf8 无需额外编解码
 */

/**
 * @param {string} content
 * @param {BufferEncoding} encoding
 * @returns {Uint8Array}
 */
module.exports.encode = function (content, encoding) {
  return Buffer.from(content, encoding);
};

/**
 * @param {Buffer} buffer
 * @param {BufferEncoding} encoding
 * @returns {string}
 */
module.exports.decode = function (buffer, encoding) {
  return buffer.toString(encoding);
};

/**
 * @param {string} encoding
 * @returns {boolean}
 */
module.exports.encodingExists = function (encoding) {
  return encoding === 'utf8';
};
