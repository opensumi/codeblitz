import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { RawContextKey } from '@opensumi/ide-core-browser/lib/raw-context-key';
import { ViewZoneDelegate } from '@opensumi/ide-monaco-enhance';

export type TFoldingType = 'up' | 'down' | 'all';

// 向上或向下展开的最大固定行数，展开全部不需要
export const CUSTOM_FOLDING_LINE_NUMBER = 20;

export interface DiffFoldingChangeData {
  type: TFoldingType;
  lineNumber: number;
  // 想要展开多少行
  unFoldNumber: number;
}

export class MiscCommands {
  static ExpandFie = {
    id: 'misc.expandFile',
  };
}

export const MISC_IS_EXPAND = 'misc.isExpand';
export const MISC_IS_EXPAND_RAW_KEY = new RawContextKey<boolean>(MISC_IS_EXPAND, false);

export const IS_DIFF_DATA = 'misc.isDiffData';
export const MISC_IS_DIFF_DATA = new RawContextKey<boolean>(IS_DIFF_DATA, false);

export interface IConverDiffByGit {
  content: string;
  type: '-' | '+' | null;
  left: number;
  right: number;
}

/**
 * folding contrib ID
 */
export const FOLDING_CONTRIB_ID = 'editor.contrib.folding';

export type TEditorType = 'original' | 'modified';

export interface IFoldingContribution extends monaco.editor.IEditorContribution {
  foldingModel: any;
}

// hock IMyViewZone
export interface IMyViewZone {
  whitespaceId: number;
  delegate: ViewZoneDelegate;
  isVisible: boolean;
  domNode: HTMLElement;
}

export interface IViewZoneChangeAccessor {
  addZone(zone: ViewZoneDelegate): number;
  removeZone(id: number): void;
  layoutZone(id: number): void;
}
