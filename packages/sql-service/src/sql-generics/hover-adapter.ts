import _get from 'lodash/get';
import {
  Position,
  CancellationToken,
  Thenable,
} from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { WorkerAccessor, CompletionProviderOptions } from '../types';
import { toMarkedStringArray } from './utils/mardown';
import { fromPosition, toRange } from './utils/editor';
import { wireCancellationToken } from './utils/promise';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';

class HoverProvider implements monaco.languages.HoverProvider {
  private options;

  constructor(private _worker: WorkerAccessor, options: CompletionProviderOptions) {
    this.options = options;
  }

  provideHover(
    model: monaco.editor.IReadOnlyModel,
    position: Position,
    token: CancellationToken
  ): Thenable<monaco.languages.Hover> {
    let resource = model.uri;

    return wireCancellationToken(
      token,
      this._worker(resource)
        .then((worker) => {
          /** 避免过度构建ast */
          return worker.doHover(resource.toString(), fromPosition(position),             {
            options: this.options.options,
            completionTypes: this.options.completionTypes,
            lowerCaseComplete: this.options.lowerCaseComplete,
            degenerate: this.options.degenerate,
          });
        })
        .then(async (info) => {
          if (!_get(info, 'type')) {
            return {} as monaco.languages.Hover;
          }

          let contents = '';

          if (this.options.onHover) {
            // 将 worker 中 hover 提示交给用户处理一道
            contents = await this.options.onHover(info);
          }

          return <monaco.languages.Hover>{
            range: toRange(info.range),
            contents: toMarkedStringArray(contents),
          };
        })
    );
  }
}

export default HoverProvider;
