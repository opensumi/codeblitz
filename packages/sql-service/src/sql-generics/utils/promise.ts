import { CancellationToken, Thenable } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';

// 早期 monaco 中使用的是一个叫 winJS 的 promise 的库
//  后期慢慢下线了，我们用的还是 老版本 monaco
// 具体下线相关可以见: https://github.com/microsoft/vscode/issues/53526

function wireCancellationToken<T>(token: CancellationToken, promise: Promise<T>): Thenable<T> {
  token.onCancellationRequested(() => {});
  return promise;
}

export { wireCancellationToken };
