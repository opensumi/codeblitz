'use strict';

const { ConcatSource } = require('webpack-sources');
const path = require('path');

class BannerPlugin {
  constructor(options) {
    if (typeof options === 'string' || typeof options === 'function') {
      options = {
        banner: options,
      };
    }
    this.options = options;
    this.banner = typeof options.banner === 'function' ? options.banner : () => options.banner;
  }

  apply(compiler) {
    const options = this.options;
    const banner = this.banner;

    compiler.hooks.compilation.tap('BannerPlugin', (compilation) => {
      compilation.hooks.processAssets.tapPromise('BannerPlugin', async () => {
        const bannerAsset = await banner();
        for (const chunk of compilation.chunks) {
          if (options.entryOnly && !chunk.canBeInitial()) {
            continue;
          }

          for (const file of chunk.files) {
            if (path.extname(file) !== '.js') {
              continue;
            }

            compilation.updateAsset(file, (old) => new ConcatSource(bannerAsset, '\n', old));
          }
        }
      });
    });
  }
}

module.exports = BannerPlugin;
