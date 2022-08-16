import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/index.css';

//#region alex
import {
  AppRenderer,
  SlotLocation,
  SlotRenderer,
  SplitPanel,
  BoxPanel,
  IAppInstance,
} from '@alipay/alex/bundle';
import '@alipay/alex/bundle/alex.css';
//#endregion

//#region 语法高亮
import '@alipay/alex/languages/html';
import '@alipay/alex/languages/handlebars';
import '@alipay/alex/languages/css';
import '@alipay/alex/languages/scss';
import '@alipay/alex/languages/less';
import '@alipay/alex/languages/javascript';
import '@alipay/alex/languages/typescript';
import '@alipay/alex/languages/json';
//#endregion

//#region 语言功能
import html from '@alipay/alex/extensions/alex.html-language-features-worker';
import css from '@alipay/alex/extensions/alex.css-language-features-worker';
import typescript from '@alipay/alex/extensions/alex.typescript-language-features-worker';
import json from '@alipay/alex/extensions/alex.json-language-features-worker';
//#endregion

//#region 获取内置模块，提供 IDE 层面的控制能力
import { IEditorDocumentModelService } from '@alipay/alex/modules/ide-editor';
import { CommandService, EDITOR_COMMANDS, URI } from '@alipay/alex/modules/ide-core-browser';
//#endregion

// 布局配置，可根据需要增删模块
export const layoutConfig = {
  [SlotLocation.left]: {
    modules: ['@opensumi/ide-explorer'],
  },
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
  // [SlotLocation.bottom]: {
  //   modules: ['@opensumi/ide-output', '@opensumi/ide-markers'],
  // },
  [SlotLocation.statusBar]: {
    modules: ['@opensumi/ide-status-bar'],
  },
};

// 界面布局组件，可根据需要调整
const LayoutComponent = () => (
  <BoxPanel direction="top-to-bottom">
    <SplitPanel overflow="hidden" id="main-horizontal" flex={1}>
      <SlotRenderer slot="left" minResize={220} minSize={49} />
      <SplitPanel id="main-vertical" minResize={300} flexGrow={1} direction="top-to-bottom">
        <SlotRenderer flex={2} flexGrow={1} minResize={200} slot="main" />
        {/* <SlotRenderer flex={1} minResize={160} slot="bottom" /> */}
      </SplitPanel>
    </SplitPanel>
    <SlotRenderer slot="statusBar" />
  </BoxPanel>
);

const App: React.FC = () => {
  const [key, setKey] = React.useState(0);
  const app = React.useRef<IAppInstance | null>(null);

  const update = () => {
    if (!app.current) return;

    const docModelService: IEditorDocumentModelService = app.current.injector.get(
      IEditorDocumentModelService
    );
    const workspaceUri = URI.file(app.current.config.workspaceDir);
    Promise.all(
      [
        {
          filepath: 'main.html',
          content: '<div id="root"></div>',
        },
        {
          filepath: 'main.js',
          content: 'console.log("main")',
        },
      ].map((item) => {
        docModelService.createModelReference(workspaceUri.resolve(item.filepath)).then((ref) => {
          ref.instance.updateContent(item.content);
        });
      })
    );
  };

  const getDirty = () => {
    if (!app.current) return;

    const docModelService: IEditorDocumentModelService = app.current.injector.get(
      IEditorDocumentModelService
    );
    const modelList = docModelService
      .getAllModels()
      .filter(
        (model) =>
          model.uri.codeUri.path.startsWith(app.current!.config.workspaceDir) && model.dirty
      );
  };

  const saveAll = () => {
    if (!app.current) return;

    const commandService: CommandService = app.current.injector.get(CommandService);
    commandService.executeCommand(EDITOR_COMMANDS.SAVE_ALL.id);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', padding: 8, overflow: 'hidden' }}>
      <div style={{ height: 40 }}>
        <Button onClick={() => setKey((k) => k + 1)}>重置</Button>
        <Button onClick={update} style={{ marginLeft: 8 }}>
          更新文件
        </Button>
        <Button onClick={getDirty} style={{ marginLeft: 8 }}>
          获取未保存文件
        </Button>
        <Button onClick={saveAll} style={{ marginLeft: 8 }}>
          保存全部文件
        </Button>
      </div>
      <div className="container" style={{ width: '50%', height: 'calc(100% - 40px)' }}>
        <AppRenderer
          key={key}
          onLoad={(_app) => {
            app.current = _app;
          }}
          appConfig={{
            // 工作空间目录，最好确保不同项目名称不同，如 group/repository 的形式，工作空间目录会挂载到 /workspace 根目录下
            workspaceDir: 'playground',
            layoutConfig,
            layoutComponent: LayoutComponent,
            // 默认偏好设置
            defaultPreferences: {
              // 主题色 ide-light | ide-dark
              'general.theme': 'ide-light',
              'editor.previewMode': false,
              // 'editor.forceReadOnly': true,
              // 'editor.readonlyFiles': ['/workspace/**']
            },
            // 左侧面板默认宽度
            panelSizes: {
              [SlotLocation.left]: 220,
            },
            // 扩展
            extensionMetadata: [html, css, typescript, json],
          }}
          runtimeConfig={{
            biz: 'alex-demo',
            // 禁止就改文件树，此时无法新增、删除、重命名文件
            disableModifyFileTree: true,
            // 默认打开文件
            defaultOpenFile: 'main.js',
            workspace: {
              // 文件系统配置
              filesystem: {
                fs: 'FileIndexSystem',
                options: {
                  // 初始全量文件索引
                  requestFileIndex() {
                    return Promise.resolve({
                      'main.html': '<div id="root"></div>',
                      'main.css': 'body {}',
                      'main.js': 'console.log("main")',
                      'package.json': '{\n  "name": "Riddle"\n}',
                    });
                  },
                },
              },
              // 文件保存事件
              onDidSaveTextDocument(e) {
                console.log('>>>save', e);
              },
              onDidChangeTextDocument(e) {
                console.log('>>>change', e);
              },
            },
            // 隐藏左侧 tabbar
            hideLeftTabBar: true,
            // 注销左侧下方的 bar，此时设置按钮会被隐藏
            unregisterActivityBarExtra: true,
          }}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('main'));
