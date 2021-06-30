import * as monaco from '@ali/monaco-editor-core/esm/vs/editor/editor.api';
import { Autowired } from '@ali/common-di';
import { Domain, Disposable, CommandContribution, CommandRegistry } from '@ali/ide-core-common';
import { IEditor, EditorType } from '@ali/ide-editor/lib/common';
import { WorkbenchEditorService } from '@ali/ide-editor/lib/browser';
import {
  BrowserEditorContribution,
  IEditorFeatureRegistry,
} from '@ali/ide-editor/lib/browser/types';
import { IThemeService } from '@ali/ide-theme';
import debounce from 'lodash.debounce';
import { CodeModelService } from './code-model.service';
import styles from './style.module.less';

@Domain(BrowserEditorContribution, CommandContribution)
export class LineDecorationContribution implements BrowserEditorContribution, CommandContribution {
  @Autowired(WorkbenchEditorService)
  editorService: WorkbenchEditorService;

  @Autowired(IThemeService)
  themeService: IThemeService;

  @Autowired(CodeModelService)
  codeModel: CodeModelService;

  private lineNumbers: [number, number] | null = null;

  private lineDecorations = new Map<string, string[]>();

  registerEditorFeature(registry: IEditorFeatureRegistry) {
    registry.registerEditorFeatureContribution({
      contribute: (editor: IEditor) => {
        const disposer = new Disposable();
        if (editor.getType() !== EditorType.CODE) return disposer;
        let oldHoverDecorations: string[] = [];
        disposer.addDispose(
          editor.monacoEditor.onMouseMove(
            debounce((event) => {
              if (this.editorService.currentEditor !== editor) {
                return;
              }

              const type = event?.target?.type;
              if (
                type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS ||
                type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
              ) {
                const lineNumber = event.target.position!.lineNumber;
                oldHoverDecorations = editor.monacoEditor.deltaDecorations(oldHoverDecorations, [
                  {
                    range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                    options: {
                      className: styles['line-content'],
                      glyphMarginClassName: `${styles['line-glyph-margin']} ${
                        styles[`line-glyph-margin-${this.themeService.getCurrentThemeSync().type}`]
                      }}`,
                    },
                  },
                ]);
              } else {
                oldHoverDecorations = editor.monacoEditor.deltaDecorations(oldHoverDecorations, []);
              }
            }, 10)
          )
        );

        disposer.addDispose(
          editor.monacoEditor.onMouseDown((event) => {
            if (this.editorService.currentEditor !== editor) {
              return;
            }

            const type = event?.target?.type;
            if (
              type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS ||
              type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
            ) {
              const clickedLineNumber = event.target.position!.lineNumber;
              const lastLineNumber = this.lineNumbers;
              let nextLineNumbers: [number, number] = [clickedLineNumber, clickedLineNumber];
              if (event?.event?.shiftKey && lastLineNumber) {
                let startLineNumber = lastLineNumber[0];
                if (startLineNumber > clickedLineNumber) {
                  nextLineNumbers = [clickedLineNumber, startLineNumber];
                } else if (startLineNumber < clickedLineNumber) {
                  nextLineNumbers = [startLineNumber, clickedLineNumber];
                }
              }
              this.lineNumbers = nextLineNumbers;
              this.highlightLine(editor);
            }
          })
        );

        disposer.addDispose(
          editor.monacoEditor.onDidChangeModel(() => {
            this.lineNumbers = null;
          })
        );

        return disposer;
      },
    });
  }

  registerCommands(registry: CommandRegistry) {
    registry.registerCommand(
      { id: 'code-service.set-line-hash' },
      {
        execute: (hash: string) => {
          if (!hash) {
            return;
          }
          const lineNumbers = this.codeModel.parseLineHash(hash);
          if (!lineNumbers) {
            return;
          }
          const currentEditor = this.editorService.currentEditorGroup?.currentEditor;
          if (currentEditor) {
            this.lineNumbers = lineNumbers;
            this.highlightLine(currentEditor);
          }
        },
      }
    );
  }

  private highlightLine(editor: IEditor) {
    if (!this.lineNumbers) {
      return [];
    }

    const [startLineNumber, endLineNumber] = this.lineNumbers;

    const newDecorations = [
      {
        range: new monaco.Range(startLineNumber, 1, endLineNumber, 1),
        options: {
          isWholeLine: true,
          linesDecorationsClassName: styles['line-anchor'],
          className: styles['line-content'],
        },
      },
    ];

    this.editorService.editorGroups.forEach((group) => {
      if (!group.currentEditor) {
        return;
      }
      this.lineDecorations.set(
        group.name,
        group.currentEditor.monacoEditor.deltaDecorations(
          this.lineDecorations.get(group.name) || [],
          group.currentEditor !== editor ? [] : newDecorations
        )
      );
    });
    this.codeModel.replaceBrowserUrlLine(this.lineNumbers);
    setTimeout(() => {
      editor.monacoEditor.revealLinesInCenterIfOutsideViewport(startLineNumber, endLineNumber);
    }, 10);
  }
}
