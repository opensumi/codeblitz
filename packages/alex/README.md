# alex

> 框架集成，并分发不同的形式

#### integration
根据不同形式集成版本，提供各版本自定义的功能及模块，可按需定制，最总都会通过 webpack 打包为一个文件，初步分类
- startup 本地测试用
- editor 纯编辑版本
- panel 带 panel 版本，可定制左右视图
- app 完整版本

#### distribution
不同形式分发，实际 export 的代码，根据不同版本使用对应 bundler，同时包含本地和远程（iframe）两种形式，初步分类
- editor 本地纯编辑版本
- editor-webview 远程纯编辑版本
- panel 本地 panel 版本
- panel-webview 远程 panel 版本
- app 本地完整版本
- app-webview 远程完整版本