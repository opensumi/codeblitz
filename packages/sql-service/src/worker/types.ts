
import {IDisposable, Uri, IEvent} from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';

export interface DiagnosticsOptions {
  readonly validate?: boolean;
  readonly allowComments?: boolean;
  readonly lint?: {
    readonly compatibleVendorPrefixes?: 'ignore' | 'warning' | 'error';
    readonly vendorPrefix?: 'ignore' | 'warning' | 'error';
    readonly duplicateProperties?: 'ignore' | 'warning' | 'error';
    readonly emptyRules?: 'ignore' | 'warning' | 'error';
    readonly importStatement?: 'ignore' | 'warning' | 'error';
    readonly boxModel?: 'ignore' | 'warning' | 'error';
    readonly universalSelector?: 'ignore' | 'warning' | 'error';
    readonly zeroUnits?: 'ignore' | 'warning' | 'error';
    readonly fontFaceProperties?: 'ignore' | 'warning' | 'error';
    readonly hexColorLength?: 'ignore' | 'warning' | 'error';
    readonly argumentsInColorFunction?: 'ignore' | 'warning' | 'error';
    readonly unknownProperties?: 'ignore' | 'warning' | 'error';
    readonly ieHack?: 'ignore' | 'warning' | 'error';
    readonly unknownVendorSpecificProperties?: 'ignore' | 'warning' | 'error';
    readonly propertyIgnoredDueToDisplay?: 'ignore' | 'warning' | 'error';
    readonly important?: 'ignore' | 'warning' | 'error';
    readonly float?: 'ignore' | 'warning' | 'error';
    readonly idSelector?: 'ignore' | 'warning' | 'error';
  }
}

export interface LanguageServiceDefaults {
  readonly onDidChange: IEvent<LanguageServiceDefaults>;
  readonly diagnosticsOptions: DiagnosticsOptions;
  setDiagnosticsOptions(options: DiagnosticsOptions): void;
}