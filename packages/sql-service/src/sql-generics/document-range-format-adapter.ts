import { WorkerAccessor, CompletionProviderOptions } from '../types';
import { wireCancellationToken } from './utils/promise';
import {
	CancellationToken,
	Thenable,
	IRange,
	Range,
} from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { transferFormatTextByCustomRules } from './utils/editor';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import * as ls from 'vscode-languageserver-types';

class DocumentRangeFormattingEditAdapter
	implements monaco.languages.DocumentRangeFormattingEditProvider {

	displayName= 'ODPS Formatter'
	extensionId = "odps-formatter"
	private options;

	constructor(private _worker: WorkerAccessor, options: CompletionProviderOptions) {
		this.options = options
	}

	provideDocumentRangeFormattingEdits(model: monaco.editor.IReadOnlyModel, range: monaco.Range, option, token): Thenable<monaco.languages.TextEdit[]> {
		const startTime = Date.now();
		const resource = model.uri;

		const document = model.getValueInRange(range);
		return wireCancellationToken(
      token,
      this._worker(resource)
        .then(worker => {
          return worker.format(resource.toString(), document,{});
        })
        .then(document => {
          // 格式化回调函数
					if (this.options?.onFormat) {
						this.options?.onFormat(document, {
							language: this.options.options.language,
							time: new Date().getTime() - startTime,
						})
					}
					return [{
						range,
						text: document
					}]
        }),
    );
	}
}

export default DocumentRangeFormattingEditAdapter;
