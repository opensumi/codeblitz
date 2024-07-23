/**
 * webpack5 tsconfig-paths-webpack-plugin 兼容性有点问题，extends 改下
 */
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Options = require('tsconfig-paths-webpack-plugin/lib/options');
const TsconfigPaths = require('tsconfig-paths');

module.exports = class TsconfigPathsPluginPatch extends TsconfigPathsPlugin.default {
  constructor(rawOptions = {}) {
    super(rawOptions);
    const options = Options.getOptions(rawOptions);
    const context = options.context || process.cwd();
    const loadFrom = options.configFile || context;
    const loadResult = TsconfigPaths.loadConfig(loadFrom);
    if (loadResult.resultType === 'failed') {
      this.log.logError(`Failed to load ${loadFrom}: ${loadResult.message}`);
    } else {
      this.matchPath = TsconfigPaths.createMatchPathAsync(
        this.absoluteBaseUrl,
        loadResult.paths,
        options.mainFields,
        false,
      );
    }
  }
};
