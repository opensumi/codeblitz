# 架构简述

CodeBlitz 将原来 OpenSumi 的功能封装成了一个 React 组件。

它的主入口在 `@codeblitzjs/ide-core` 这个包，用起来很简单：

```tsx
import { AppRenderer, EditorRenderer } from '@codeblitzjs/ide-core';

function App() {
    return <AppRenderer appConfig={{}} />
}

function Editor() {
    return <EditorRenderer appConfig={{}} />
}
```

此外还提供了 `DiffViewerRenderer`，这是我们的新版 Diff 组件，所有的 diff 在行内展示，并且可以让用户选择是否采纳，
对于 AI 生成代码的场景特别有用。

## 产物

CodeBlitz 有一个很特别的地方是它打包的产物分 `bundle` 与 `lib` 两种版本：

1. lib 下为源码经过 tsc 编译后的文件，因此如直接从 lib 下引用，那么可根据需要使用 OpenSumi (@opensumi/ide-*) 和 monaco (@opensumi/monaco-editor-core/esm) 相关模块，满足高定制的应用的需求，可以参考 [OpenSumi 开发文档](https://opensumi.com/zh/docs/integrate/universal-integrate-case/custom-view)。另外由于 lib 下的样式文件为 less，因此 webpack 需要额外处理 less 的编译。

2. 提供 bundle 方式可以减少集成方打包的时间，缺点就是整个 bundle 包体积很大。
    bundle 下为打包好的文件，只需引入 js 和 css 即可。

同时 CodeBlitz 还会打包成 umd 格式，方便在浏览器中直接引用，它的导出名为 `Alex`。
