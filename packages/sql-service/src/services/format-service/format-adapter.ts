// import { WorkerAccessor, CompletionProviderOptions } from '../../definitions';
// import { wireCancellationToken } from './utils/promise';
// import { CancellationToken, Thenable } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
// import { transferFormatTextByCustomRules } from './utils/editor';
// import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';

// class FormatterAdapter implements monaco.languages.DocumentFormattingEditProvider {
//   private options;

//   constructor(private _worker: WorkerAccessor, options: CompletionProviderOptions) {
//     this.options = options;
//   }

//   provideDocumentFormattingEdits(
//     model: monaco.editor.IReadOnlyModel,
//     options: monaco.languages.FormattingOptions,
//     token: CancellationToken,
//   ): Thenable<monaco.editor.ISingleEditOperation[]> {
//     const resource = model.uri;
//     const startTime = Date.now();

//     const formatText = model.getValue();
//     const formatOptions = {
//       lowerCase: this.options.lowerCaseComplete, //关键词小写
//     };

//     const { value, callback } = transferFormatTextByCustomRules(
//       formatText,
//       this.options.formatRules,
//     );

//     // 1400关键词，600行SQL耗时700ms，经无浊哥建议，改为worker中处理（公屏上打上 大拇指）
//     return wireCancellationToken(
//       token,
//       this._worker(resource)
//         .then(worker => {
//           return worker.format(resource.toString(), value, formatOptions);
//         })
//         .then(document => {
//           // 还原SQL
//           const text = callback(document);
//           // 格式化回调函数
//           if (this.options?.onFormat) {
//             this.options?.onFormat(text, {
//               language: this.options.options.language,
//               time: Date.now() - startTime,
//             });
//           }
//           return [
//             {
//               range: {
//                 startLineNumber: 0,
//                 startColumn: 0,
//                 endLineNumber: 10000,
//                 endColumn: 10000,
//               },
//               text,
//             },
//           ];
//         }),
//     );
//   }
// }

// export default FormatterAdapter;
