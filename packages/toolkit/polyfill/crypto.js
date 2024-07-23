/**
 * @module crypto 的 createHash 简单实现，ide-fw 使用了 createHash 的 md5
 * 不直接使用 polyfill，否则体积会增大 1M
 */

const md5 = require('md5');

function throwIfNotStringOrBuffer(val, prefix) {
  if (!Buffer.isBuffer(val) && typeof val !== 'string') {
    throw new TypeError(prefix + ' must be a string or a buffer');
  }
}

class MD5 {
  constructor() {
    this._finalized = false;
    /** @type {Buffer[]} */
    this._buffer = [];
  }

  /**
   * @param {string|Buffer} data
   * @param {BufferEncoding} encoding
   */
  update(data, encoding) {
    throwIfNotStringOrBuffer(data);
    if (this._finalized) throw new Error('Digest already called');
    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(data, encoding);
    }
    this._buffer.push(data);
    return this;
  }

  /**
   * @param {BufferEncoding | undefined} encoding
   */
  digest(encoding) {
    if (this._finalized) throw new Error('Digest already called');
    this._finalized = true;
    const buf = Buffer.concat(this._buffer);
    const bytes = Buffer.from(md5(buf, { asBytes: true }));
    this._buffer.length = 0;
    return encoding !== undefined ? bytes.toString(encoding) : bytes;
  }
}

/**
 * @param {'md5'|string} alg
 */
exports.createHash = function createHash(alg) {
  alg = alg.toLowerCase();
  if (alg !== 'md5') {
    throw new Error(`${alg} is not implemented, please use md5`);
  }
  return new MD5();
};

exports.randomBytes = function() {
  throw new Error('crypto.randomBytes is not implemented');
};
