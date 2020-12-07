# toolkit

开发打包等统一工具箱，作为独立包可外部复用

- webpack 为 webpack 配置，可在外部自定义 module 打包，统一了配置
- polyfill node 的 polyfill，对 process, os 需要更强的自定义，因为不使用第三方的，对于 crypto 只提供部分 api 简单实现，否则户增大包体积（实际发现会多 1M）
