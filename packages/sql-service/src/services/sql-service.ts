import { Provider, Injectable, Autowired } from '@opensumi/di';
import {
  Domain,
  BrowserModule,
  CommandContribution,
  CommandRegistry,
  getLanguageId,
  Disposable,
  CommandService,
} from '@opensumi/ide-core-browser';
import { CodeModelService } from '@alipay/alex-code-service';
import {} from '@alipay/alex-code-service';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { StandaloneServices } from '@opensumi/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices';
// import { WorkerAccessor } from './types';



// @Domain(CommandContribution, )
// export class SqlContribution extends Disposable implements CommandContribution {
//   registerCommands(commands: CommandRegistry): void {
//     // throw new Error('Method not implemented.');
//   }
//   @Autowired()
//   codeModel: CodeModelService;

//   @Autowired(CommandService)
//   commandService: CommandService;

//   abc =  monaco.languages
//   $registerCompletionSupport(
//     handle: number,
//     selector: SerializedDocumentFilter[],
//     triggerCharacters: string[],
//     supportsResolveDetails: boolean,
//   ): void {
//     this.disposables.set(
//       handle,
//       monaco.languages.registerCompletionItemProvider(fromLanguageSelector(selector)!, {
//         triggerCharacters,
//         provideCompletionItems: async (
//           model: ITextModel,
//           position: monaco.Position,
//           context,
//           token: monaco.CancellationToken,
//         ) => {
//           if (!this.isLanguageFeatureEnabled(model)) {
//             return undefined;
//           }
//           const timer = this.reporter.time(REPORT_NAME.PROVIDE_COMPLETION_ITEMS);
//           const result = await this.proxy.$provideCompletionItems(handle, model.uri, position, context, token);
//           if (!result) {
//             return undefined;
//           }

//           if (result[ISuggestResultDtoField.completions].length) {
//             timer.timeEnd(extname(model.uri.fsPath), {
//               extDuration: result.d,
//             });
//           }
//           const suggestions = result[ISuggestResultDtoField.completions].map((data) =>
//             this.inflateSuggestDto(result[ISuggestResultDtoField.defaultRanges], data),
//           ) as unknown as monaco.languages.CompletionItem[];
//           return {
//             suggestions,
//             duration: result[ISuggestResultDtoField.duration],
//             incomplete: result[ISuggestResultDtoField.isIncomplete] || false,
//             dispose: () => {
//               if (result.x) {
//                 setTimeout(() => {
//                   this.proxy.$releaseCompletionItems(handle, result.x!);
//                 }, 0);
//               }
//             },
//           };
//         },
//         resolveCompletionItem: supportsResolveDetails
//           ? async (suggestion, token) => {
//               this.reporter.point(REPORT_NAME.RESOLVE_COMPLETION_ITEM);
//               return this.proxy.$resolveCompletionItem(handle, suggestion._id!, token).then((result) => {
//                 if (!result) {
//                   return suggestion;
//                 }
//                 const newSuggestion = this.inflateSuggestDto(suggestion.range, result);
//                 return mixin(suggestion, newSuggestion, true);
//               });
//             }
//           : undefined,
//       }),
//     );
//   }
// }
