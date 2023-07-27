const path = require('path');

/**
 * @typedef {import('webpack').Configuration} Configuration
 * @typedef {Object} NodePolyfill
 * @property {Configuration['resolve']['alias']} alias
 * @property {Configuration['resolve']['fallback']} fallback
 * @property {Record<string, any>} provider
 */

/** @type {NodePolyfill} */
exports.nodePolyfill = {
  alias: {
    assets: require.resolve('assert/'),
    buffer: require.resolve('buffer/'),
    'iconv-lite': require.resolve('iconv-lite-umd'),
  },
  fallback: {
    net: false,
    child_process: false,
    http: false,
    https: false,
    fs: false,
    path: require.resolve('path-browserify'),
    os: require.resolve('os-browserify/browser'),
    crypto: resolvePolyfill('crypto'),
  },
  provider: {
    process: resolvePolyfill('process'),
    Buffer: ['buffer', 'Buffer'],
  },
};

exports.config = {
  appEntry: 'codeblitz',
  appGlobalEntry: 'codeblitz.global',
  appGlobalMinEntry: 'codeblitz.global.min',
  editorEntry: 'codeblitz.editor',
  editorAllEntry: 'codeblitz.editor.all',
  editorAllGlobalEntry: 'codeblitz.editor.all.global',
  editorAllGlobalMiniEntry: 'codeblitz.editor.all.global.min',
  workerEntry: 'worker-host',
  webviewEntry: 'webview',
  languageGlobalEntry: 'languages.global',
  languageGlobalMinEntry: 'languages.global.min',
  alexAllGlobalEntry: 'codeblitz.all.global',
  alexAllGlobalMinEntry: 'codeblitz.all.global.min',
};

exports.manifestSeed = {};

function resolvePolyfill(moduleName) {
  return path.join(__dirname, '../../polyfill', moduleName);
}
