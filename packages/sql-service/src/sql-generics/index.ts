import CodeActionProvider from './code-action-adapter';
import CompletionAdapter from './completion-adapter';
import DefinitionAdapter from './definition-adapter';
import DiagnosticsAdapter from './diagnostic-adapter';
import DocumentColorAdapter from './document-color-adapter';
import DocumentFormattingEditAdapter from './document-format-adapter';
import DocumentRangeFormattingEditAdapter from './document-range-format-adapter';
import HoverAdapter from './hover-adapter';
import SignatureHelpAdapter from './signature-help-adapter';


export const SQLGenericsFeatures = {
  CompletionAdapter,
  CodeActionProvider,
  DefinitionAdapter,
  DiagnosticsAdapter,
  DocumentColorAdapter,
  DocumentFormattingEditAdapter,
  DocumentRangeFormattingEditAdapter,
  HoverAdapter,
  SignatureHelpAdapter,
}

