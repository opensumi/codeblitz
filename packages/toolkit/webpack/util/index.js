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
  appEntry: 'alex',
  appGlobalEntry: 'alex.global',
  appGlobalMinEntry: 'alex.global.min',
  editorEntry: 'alex.editor',
  editorAllEntry: 'alex.editor.all',
  editorAllGlobalEntry: 'alex.editor.all.global',
  editorAllGlobalMiniEntry: 'alex.editor.all.global.min',
  workerEntry: 'worker-host',
  odpsEntry: 'odps-worker',
  webviewEntry: 'webview',
  languageGlobalEntry: 'languages.global',
  languageGlobalMinEntry: 'languages.global.min',
  acrEntry: 'acr',
  acrGlobalEntry: 'acr.global',
  acrGlobalMinEntry: 'acr.global.min',
  alexAllGlobalEntry: 'alex.all.global',
  alexAllGlobalMinEntry: 'alex.all.global.min',
};

// just for shared
exports.manifestSeed = {};

function resolvePolyfill(moduleName) {
  return path.join(__dirname, '../../polyfill', moduleName);
}
