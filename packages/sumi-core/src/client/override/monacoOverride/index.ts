import { Provider } from '@opensumi/di';
import { IBulkEditServiceShape } from '@opensumi/ide-workspace-edit';
import { IMonacoCodeService, MonacoCodeService, monacoCodeServiceProxy } from './codeEditorService';
import { IMonacoCommandServiceProxy, monacoCommandServiceProxy, MonacoTextModelService } from './commandService';
import { IMonacoBulkEditServiceProxy, MonacoBulkEditService, monacoBulkEditServiceProxy } from './workspaceEditService';

import { MonacoCommandService } from '@opensumi/ide-editor/lib/browser/monaco-contrib/command/command.service';
import { ICommandServiceToken } from '@opensumi/ide-monaco/lib/browser/contrib/command';
import { IMonacoTextModelService, monacoTextModelServiceProxy } from './textModelService';

// monaco override 暂时用不到
export const MonacoOverrides: Provider[] = [
  {
    token: MonacoCodeService,
    useValue: monacoCodeServiceProxy,
    override: true,
  },
  {
    token: IMonacoCodeService,
    useClass: MonacoCodeService,
  },
  // MonacoTextModelService
  {
    token: MonacoTextModelService,
    useValue: monacoTextModelServiceProxy,
    override: true,
  },
  {
    token: IMonacoTextModelService,
    useClass: MonacoTextModelService,
  },
  // IBulkEditServiceShape
  {
    token: IBulkEditServiceShape,
    useValue: monacoBulkEditServiceProxy,
    override: true,
  },
  {
    token: IMonacoBulkEditServiceProxy,
    useClass: MonacoBulkEditService,
  },
  // MonacoCommandService
  {
    token: ICommandServiceToken,
    useValue: monacoCommandServiceProxy,
    override: true,
  },
  {
    token: IMonacoCommandServiceProxy,
    useClass: MonacoCommandService,
  },
];
