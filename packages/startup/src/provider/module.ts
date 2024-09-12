import { Autowired, Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { IEditorDocumentModelContentProvider, BrowserEditorContribution, IEditorDocumentModelContentRegistry } from '@opensumi/ide-editor/lib/browser'
import { URI, Emitter, Event, Domain, Deferred } from '@opensumi/ide-core-common'

export const diffsDeferred = new Deferred<{filePath: string, oldFileContent: string | null, newFileContent: string }[]>()

@Injectable()
export class SampleSchemeDocumentProvider implements IEditorDocumentModelContentProvider {
  handlesScheme(scheme: string) {
    return scheme === 'sample';
  }

  async provideEditorDocumentModelContent(uri: URI): Promise<string> {
    const diffs = await diffsDeferred.promise
    const diff = diffs.find(item => item.filePath === uri.codeUri.path.slice(1))
    if (!diff) return ''
    if (uri.authority === 'new') return diff.newFileContent
    return diff.oldFileContent || ''
  }

  isReadonly() {
    return false;
  }

  private _onDidChangeContent: Emitter<URI> = new Emitter();
  onDidChangeContent: Event<URI> = this._onDidChangeContent.event;
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
