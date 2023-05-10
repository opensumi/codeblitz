import { fromPosition } from './utils/editor';
import { wireCancellationToken } from './utils/promise';
import { WorkerAccessor, CompletionProviderOptions } from '../types';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';

class SignatureHelpAdapter implements monaco.languages.SignatureHelpProvider {
  private options;

  constructor(private _worker: WorkerAccessor, options: CompletionProviderOptions) {
    this.options = options;
  }

  public signatureHelpTriggerCharacters: string[] = ['(', ','];

  provideSignatureHelp(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    token: monaco.CancellationToken,
    context: monaco.languages.SignatureHelpContext,
  ): monaco.languages.ProviderResult<monaco.languages.SignatureHelpResult> {
    // 获取当前光标所在位置前的函数名
    const resource = model.uri;

    return wireCancellationToken(
      token,
      this._worker(resource)
        .then(worker => {
          return worker.doSignatureHelp(resource.toString(), fromPosition(position), context);
        })
        .then(async (info:  monaco.languages.SignatureHelp) => {
          if (!this.options.enableSignature) {
            return {} as monaco.languages.SignatureHelpResult;
          }
          return { value: info } as monaco.languages.SignatureHelpResult;
        }),
    );
  }
}

export default SignatureHelpAdapter;
