import { Autowired, Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { IEditorDocumentModelContentProvider, BrowserEditorContribution, IEditorDocumentModelContentRegistry } from '@opensumi/ide-editor/lib/browser'
import { URI, Emitter, Event, Domain, IEditorDocumentChange, IEditorDocumentModelSaveResult, SaveTaskResponseState } from '@opensumi/ide-core-common'

export interface IDiffData {
  filePath: string;
  oldFileContent: string | null;
  newFileContent: string;
}

class DiffService {
  #data: IDiffData[] | null = null
  #dataEmitter = new Emitter<URI[]>()
  onDataChange = this.#dataEmitter.event;

  get data() {
    return this.#data;
  }
  updateData(data: IDiffData[]) {
    const lastData = this.#data
    this.#data = data
    const lastDataMap: Record<string, IDiffData> = lastData?.reduce((obj, item) => {
      obj[item.filePath] = item
      return obj
    }, {}) || {}
    const uris: URI[] = []
    data.forEach(item => {
      const lastItem = lastDataMap?.[item.filePath]
      if (!lastItem) return
      if (item.oldFileContent !== lastItem.oldFileContent) {
        uris.push(new URI(`sample://old/${item.filePath}`))
      }
      if (item.newFileContent !== lastItem.newFileContent) {
        uris.push(new URI(`sample://new/${item.filePath}`))
      }
    })
    this.#dataEmitter.fire(uris)
  }

  clear() {
    this.#data = null
  }
}

export const diffService = new DiffService()

@Injectable()
export class SampleSchemeDocumentProvider implements IEditorDocumentModelContentProvider {
  private _onDidChangeContent: Emitter<URI> = new Emitter();
  onDidChangeContent: Event<URI> = this._onDidChangeContent.event;

  constructor() {
    diffService.onDataChange((uris) => {
      uris.forEach(uri => this._onDidChangeContent.fire(uri))
    })
  }

  handlesScheme(scheme: string) {
    return scheme === 'sample';
  }

  async provideEditorDocumentModelContent(uri: URI): Promise<string> {
    const diffs = diffService.data || []
    const diff = diffs.find(item => item.filePath === uri.codeUri.path.slice(1))
    if (!diff) return ''
    if (uri.authority === 'new') return diff.newFileContent
    return diff.oldFileContent || ''
  }

  isReadonly() {
    return false;
  }

  async saveDocumentModel(uri: URI, content: string, baseContent: string, changes: IEditorDocumentChange[]): Promise<IEditorDocumentModelSaveResult> {
    console.log(uri, content, baseContent, changes)
    return {
      state: SaveTaskResponseState.SUCCESS,
    }
  }
}

@Domain(BrowserEditorContribution)
class SampleContribution implements BrowserEditorContribution {
  @Autowired(SampleSchemeDocumentProvider)
  private readonly sampleSchemeDocumentProvider: SampleSchemeDocumentProvider;

  registerEditorDocumentModelContentProvider(registry: IEditorDocumentModelContentRegistry): void {
    registry.registerEditorDocumentModelContentProvider(this.sampleSchemeDocumentProvider)
  }
}

@Injectable()
export class SampleModule extends BrowserModule {
  providers: Provider[] = [SampleContribution];
}
