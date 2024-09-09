import { Autowired, Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { IEditorDocumentModelContentProvider, BrowserEditorContribution, IEditorDocumentModelContentRegistry } from '@opensumi/ide-editor/lib/browser'
import { URI, Emitter, Event, Domain } from '@opensumi/ide-core-common'

const contentMap = {
  'a1.js': `const add = (x, y) => {
  return x + y
}
`,
  'a2.js': `const add = (x, y) => {
  return x + y + 1
}
`,
}

@Injectable()
export class SampleSchemeDocumentProvider implements IEditorDocumentModelContentProvider {
  handlesScheme(scheme: string) {
    return scheme === 'sample';
  }

  async provideEditorDocumentModelContent(uri: URI): Promise<string> {
    return contentMap[uri.codeUri.path.slice(1)]
  }

  isReadonly() {
    return true;
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
