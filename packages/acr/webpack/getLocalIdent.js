const path = require('path');
const normalizePath = require('normalize-path');
const cssesc = require('cssesc');
const { interpolateName } = require('loader-utils');

// eslint-disable-next-line no-control-regex
const filenameReservedRegex = /[<>:"/\\|?*\x00-\x1F]/g;
// eslint-disable-next-line no-control-regex
const reControlChars = /[\u0000-\u001f\u0080-\u009f]/g;
const reRelativePath = /^\.+/;

// https://github.com/webpack-contrib/css-loader/blob/fe0e6c94d0dc98432ab5af44ad1d44cf7f8870b6/src/utils.js#L48
module.exports = function getLocalIdent(loaderContext, localIdentName, localName, options) {
  if (!options.context) {
    // eslint-disable-next-line no-param-reassign
    options.context = loaderContext.rootContext;
  }

  const request = normalizePath(path.relative(options.context || '', loaderContext.resourcePath));

  // eslint-disable-next-line no-param-reassign
  options.content = `${options.hashPrefix + request}+${unescape(localName)}`;

  // Using `[path]` placeholder outputs `/` we need escape their
  // Also directories can contains invalid characters for css we need escape their too
  return cssesc(
    interpolateName(loaderContext, localIdentName, options)
      // For `[hash]` placeholder
      .replace(/^((-?[0-9])|--)/, '_$1')
      .replace(filenameReservedRegex, '-')
      .replace(reControlChars, '-')
      .replace(reRelativePath, '-')
      .replace(/\./g, '-'),
    { isIdentifier: true }
  ).replace(/\\\[local\\\]/gi, localName);
};
