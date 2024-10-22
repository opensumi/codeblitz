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
