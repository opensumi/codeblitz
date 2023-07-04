import { WorkerAccessor, CompletionProviderOptions } from '../types';
import { Range } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api'
class CodeActionProvider implements monaco.languages.CodeActionProvider {
  private options: CompletionProviderOptions;

  constructor(private _worker: WorkerAccessor, options: CompletionProviderOptions) {
    this.options = options;
  }

  async provideCodeActions(
    model: monaco.editor.ITextModel,
    range: Range,
    context: monaco.languages.CodeActionContext,
    token,
    ...rest
  ): Promise<monaco.languages.CodeActionList> {
    const { onQuickfix } = this.options;
    if (onQuickfix) {
      // https://stackoverflow.com/questions/57994101/show-quick-fix-for-an-error-in-monaco-editor
      const markers = await onQuickfix(context.markers);
      let actions = markers.map(({ title, replace, range, error, jumpUrl }, index) => {
        const diagnostic = error || context.markers[index];

        const common = {
          title,
          diagnostics: [diagnostic],
          kind: 'quickfix',
          isPreferred: true,
        };

        // if (jumpUrl) {
        //   const [url, cacheData] = jumpUrl.split('&tableCacheInLocal=');
        //   return {
        //     ...common,
        //     command: {
        //       title: '跳转链接',
        //       id: 'jumpTableApply',
        //       arguments: [url, cacheData],
        //     },
        //   };
        // }

        return {
          ...common,
          edit: {
            edits: [
              {
                resource: model.uri,
                textEdit: {
                  range: range || { ...diagnostic },
                  text: replace, // text to replace with
                },
              },
            ],
          },
        }  as monaco.languages.CodeAction;
      });

      const list = {
        actions,
        dispose: () => {}
      } as monaco.languages.CodeActionList;
      // @ts-ignore
      return Promise.resolve(list)
    }
    return Promise.resolve({
      actions: [],
      dispose: () =>{}
    } as unknown as monaco.languages.CodeActionList);
  }
}

export default CodeActionProvider;
