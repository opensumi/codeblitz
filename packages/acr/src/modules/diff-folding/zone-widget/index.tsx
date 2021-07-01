import * as monaco from '@ali/monaco-editor-core/esm/vs/editor/editor.api';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import clsx from 'classnames';
import { ZoneWidget } from '@ali/ide-monaco-enhance';
import * as styles from './styles.module.less';
import { localize, Emitter, Event, formatLocalize, Position } from '@ali/ide-core-common';
import { DiffFoldingChangeData, TFoldingType } from '..';
import { getIcon } from '@ali/ide-core-browser';

export class DiffFoldingZoneWidget extends ZoneWidget {
  private _wrapper: HTMLDivElement;

  protected readonly _onDidChangeFoldData = new Emitter<DiffFoldingChangeData>();
  readonly onDidChangeFoldData: Event<DiffFoldingChangeData> = this._onDidChangeFoldData.event;

  constructor(editor: monaco.editor.ICodeEditor) {
    super(editor);

    this._wrapper = document.createElement('div');
    this._container.appendChild(this._wrapper);
  }

  private handleChangeData(data: DiffFoldingChangeData) {
    this._onDidChangeFoldData.fire(data);
  }

  renderColumnList(list: DiffFoldingChangeData[]) {
    ReactDOM.render(
      <div className={styles.folding_zone_widget_container}>
        <ul className={styles.columen_ul}>
          {list.map((li, index) => {
            return (
              <li className={styles.columen_li} key={index}>
                <a onClick={() => this.handleChangeData(li)}>
                  <i className={this.coverTypeToIcon(li.type)}></i>
                  <span>{this.coverTypeToName(li)}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>,
      this._wrapper
    );
  }

  coverTypeToName(val: DiffFoldingChangeData): string {
    const line = val.unFoldNumber;
    return {
      all: formatLocalize('codereview.folding.expandAll', val.lineNumber === 1 ? line + 1 : line),
      down: formatLocalize('codereview.folding.expandDown', line),
      up: formatLocalize('codereview.folding.expandUp', line),
    }[val.type];
  }

  coverTypeToIcon(type: TFoldingType): string {
    return {
      all: clsx(styles.widget_icon, getIcon('colum-height')),
      down: clsx(styles.widget_icon, styles.rotate, getIcon('totop')),
      up: clsx(styles.widget_icon, getIcon('totop')),
    }[type];
  }

  applyClass() {}

  convertModelPositionToViewPosition(lineNumber: number): number {
    const coordinatesConverter = (this.editor as any)._modelData?.viewModel?.coordinatesConverter;
    // @ts-ignore
    if (!coordinatesConverter) return null;

    const modelPosition = coordinatesConverter.convertModelPositionToViewPosition(
      new Position(lineNumber, 1)
    );

    return modelPosition.lineNumber;
  }

  flushWhitespacesZones() {
    const { startLineNumber } = this.currentRange;
    const getEquivalentLine = this.convertModelPositionToViewPosition(startLineNumber);
    const viewLayout = (this.editor as any)._modelData.viewModel.viewLayout;
    const getWhitespacesLine = viewLayout
      .getWhitespaces()
      .find((e) => e.afterLineNumber === getEquivalentLine && e.heightInLines === 0);
    if (getWhitespacesLine) {
      viewLayout.changeWhitespace(getWhitespacesLine.id, getWhitespacesLine.afterLineNumber, 20);
    }
  }

  applyStyle() {}
}
