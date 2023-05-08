import { WorkerAccessor, CompletionProviderOptions } from '../types';
import { wireCancellationToken } from './utils/promise';
import { CancellationToken, Thenable } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { transferFormatTextByCustomRules } from './utils/editor';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api'
class FormatterAdapter implements monaco.languages.DocumentFormattingEditProvider {
  private options;

  constructor(private _worker: WorkerAccessor, options: CompletionProviderOptions) {
    this.options = options;
  }

  provideDocumentFormattingEdits(
    model: monaco.editor.IReadOnlyModel,
    options: monaco.languages.FormattingOptions,
    token: CancellationToken,
  ): Thenable<monaco.languages.TextEdit[]> {
    const resource = model.uri;
    const startTime = Date.now();

    const formatText = model.getValue();
    const formatOptions = {
      lowerCase: this.options.lowerCaseComplete, //关键词小写
    };

    const { value, callback } = transferFormatTextByCustomRules(
      formatText,
      this.options.formatRules,
    ) as any;

    return wireCancellationToken(
      token,
      this._worker(resource)
        .then(worker => {
          return worker.format(resource.toString(), value, formatOptions);
        })
        .then(document => {
          // 还原SQL
          const text = callback(document);
          // 格式化回调函数
          if (this.options?.onFormat) {
            this.options?.onFormat(text, {
              language: this.options.options.language,
              time: Date.now() - startTime,
            });
          }
          return [
            {
              range: {
                startLineNumber: 0,
                startColumn: 0,
                endLineNumber: 10000,
                endColumn: 10000,
              },
              text,
            } as monaco.languages.TextEdit,
          ];
        }),
    );
  }
}

export default FormatterAdapter;
