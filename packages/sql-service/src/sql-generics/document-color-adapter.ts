import { WorkerAccessor } from '../types';
import { CancellationToken, Thenable } from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { wireCancellationToken } from './utils/promise';
import { fromRange } from './utils/editor';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api'
class DocumentColorAdapter implements monaco.languages.DocumentColorProvider {
  constructor(private _worker: WorkerAccessor) {}

  public provideDocumentColors(
    model: monaco.editor.IReadOnlyModel,
    token: CancellationToken,
  ): Thenable<monaco.languages.IColorInformation[]> {
    const resource = model.uri;

    return wireCancellationToken(
      token,
      this._worker(resource)
        .then(worker => worker.findDocumentColors(resource.toString()))
        .then(infos => {
          if (!infos) {
            return;
          }
          return infos.map(item => ({
            color: item.color,
            range: {
              startLineNumber: 0,
              startColumn: 0,
              endLineNumber: 10000,
              endColumn: 10000,
            },
          }));
        }),
    );
  }

  public provideColorPresentations(
    model: monaco.editor.IReadOnlyModel,
    info: monaco.languages.IColorInformation,
    token: CancellationToken,
  ): Thenable<monaco.languages.IColorPresentation[]> {
    const resource = model.uri;

    return wireCancellationToken(
      token,
      this._worker(resource)
        .then(worker => worker.getColorPresentations(info.color, fromRange(info.range)))
        .then(presentations => {
          if (!presentations) {
            return [];
          }

          return [
            {
              label: 'one',
              color: { red: 1, blue: 0, green: 0, alpha: 1 },
              range: {
                startLineNumber: 1,
                startColumn: 0,
                endLineNumber: 1,
                endColumn: 0,
              },
            },
            {
              label: 'two',
              color: { red: 0, blue: 1, green: 0, alpha: 1 },
              range: {
                startLineNumber: 2,
                startColumn: 0,
                endLineNumber: 2,
                endColumn: 0,
              },
            },
            {
              label: 'three',
              color: { red: 0, blue: 0, green: 1, alpha: 1 },
              range: {
                startLineNumber: 3,
                startColumn: 0,
                endLineNumber: 3,
                endColumn: 0,
              },
            },
          ];
        }),
    );
  }
}

export default DocumentColorAdapter;
