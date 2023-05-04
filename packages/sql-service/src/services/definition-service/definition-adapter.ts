// import { WorkerAccessor, CompletionProviderOptions } from '../../definitions';
// import { Position, CancellationToken, Uri } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
// import { wireCancellationToken } from './utils/promise';
// import { fromPosition } from './utils/editor';
// import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';

// class DefinitionProvider implements monaco.languages.DefinitionProvider {
//   private options;
//   constructor(private _worker: WorkerAccessor, options: CompletionProviderOptions) {
//     this.options = options;
//   }
//   async provideDefinition(
//     model: monaco.editor.ITextModel,
//     position: Position,
//     token: CancellationToken,
//   ) {
//     let resource = model.uri;
//     return wireCancellationToken(
//       token,
//       this._worker(resource)
//         .then(worker => {
//           return worker.doDefinition(resource.toString(), fromPosition(position));
//         })
//         .then(async info => {
//           if (info?.type && this.options.onDefinition) {
//             // 存在类型才处理
//             const uri: string = await this.options.onDefinition({
//               type: info?.type,
//               contents: info?.contents,
//             });
//             if (!uri) {
//               return;
//             } else {
//               let range = new monaco.Range(
//                 info.range?.start.line,
//                 info.range?.start.character,
//                 info.range?.end.line,
//                 info.range?.end.character,
//               );
//               //  goToDefinitionMouse，如果单条数据会抛异常，这边就传递2个一样的定义参数
//               /**
//                * Model not found
//                * at SimpleEditorModelResolverService.../node_modules/monaco-editor/esm/vs/editor/standalone/browser/simpleServices.js.SimpleEditorModelResolverService.createModelReference (simpleServices.js:91)
//                * at goToDefinitionMouse.js:109
//                * datago的处理是自己封装一个monaco库，重新打包
//                * 这边就传递2个相同定义的参数，测试过无问题
//                */
//               setTimeout(() => {
//                 // 增加setTimeout,是因为多个定义类型的时候内部也会处理，下划线会变成单个work，且会有提示信息（多个 defined xxxx）
//                 this.options.editorMap
//                   .get(model.id)
//                   .getContribution('editor.contrib.gotodefinitionwithmouse')
//                   .addDecoration(range, '');
//               }, 0);

//               return <monaco.languages.ProviderResult<monaco.languages.Definition>>[
//                 {
//                   uri: Uri.parse(uri),
//                   range,
//                 },
//                 {
//                   uri: Uri.parse(uri),
//                   range,
//                 },
//               ];
//             }
//           }
//         }),
//     );
//   }
// }

// export default DefinitionProvider;
