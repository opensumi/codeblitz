import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AppRenderer,
  BrowserFSFileType as FileType,
  IAppRendererProps,
} from '@codeblitzjs/ide-core';
import '@codeblitzjs/ide-core/languages';
import Select from 'antd/lib/select';
import 'antd/lib/select/style';

const dirMap: Record<string, [string, FileType][]> = {
  '/': [
    ['lib', FileType.DIRECTORY],
    ['Readme.md', FileType.FILE],
    ['LICENSE', FileType.FILE],
    ['package.json', FileType.FILE],
  ],
  '/lib': [
    ['application.js', FileType.FILE],
    ['context.js', FileType.FILE],
    ['request.js', FileType.FILE],
    ['response.js', FileType.FILE],
  ],
};

let zipData: Buffer;

const zipDataPromise = (async () => {
  const res = await fetch(
    'http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/green-trail-test/dc85f34d-2467-436b-a0fe-092133ead0d6/demo.zip'
  );
  const buf = await res.arrayBuffer();
  zipData = Buffer.from(new Uint8Array(buf));
})();

const App = () => {
  const [fsType, setFsType] = useState<string>('');

  const filesystem = useMemo<
    NonNullable<IAppRendererProps['runtimeConfig']['workspace']>['filesystem'] | undefined
  >(() => {
    switch (fsType) {
      case 'IndexedDB':
        return {
          fs: 'IndexedDB',
          options: {
            storeName: 'my_db',
          },
        };
      case 'InMemory':
        return {
          fs: 'InMemory',
        };
      case 'FileIndexSystem':
        return {
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
        };
      case 'DynamicRequest':
        return {
          fs: 'DynamicRequest',
          options: {
            readDirectory(p: string) {
              return dirMap[p];
            },
            async readFile(p) {
              const res = await fetch(
                `http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/green-trail-test/a87fb80d-3028-4b19-93a9-2da6f871f369/koa${p}`
              );
              return Buffer.from(await res.arrayBuffer());
            },
          },
        };
      case 'ZipFS':
        return {
          fs: 'ZipFS',
          options: {
            zipData,
          },
        };
      case 'FolderAdapter':
        return {
          fs: 'FolderAdapter',
          options: {
            folder: '/demo',
            wrapped: {
              fs: 'ZipFS',
              options: {
                zipData,
              },
            },
          },
        };
      case 'OverlayFS':
        return {
          fs: 'OverlayFS',
          options: {
            writable: { fs: 'InMemory' },
            readable: {
              fs: 'DynamicRequest',
              options: {
                readDirectory(p: string) {
                  return dirMap[p];
                },
                async readFile(p) {
                  const res = await fetch(
                    `http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/green-trail-test/a87fb80d-3028-4b19-93a9-2da6f871f369/koa${p}`
                  );
                  return Buffer.from(await res.arrayBuffer());
                },
              },
            },
          },
        };
    }
  }, [fsType]);

  const workspace = filesystem
    ? {
        filesystem,
        onDidChangeTextDocument(e) {
          console.log('>>>onDidChangeTextDocument', e);
        },
        onDidSaveTextDocument(e) {
          console.log('>>>onDidSaveTextDocument', e);
        },
        onDidCreateFiles(e) {
          console.log('>>>onDidCreateFiles', e);
        },
        onDidChangeFiles(e) {
          console.log('>>>onDidChangeFiles', e);
        },
        onDidDeleteFiles(e) {
          console.log('>>>onDidDeleteFiles', e);
        },
      }
    : undefined;

  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: 48, display: 'flex', alignItems: 'center' }}>
        <Select value={fsType} onChange={(e) => setFsType(e as string)} style={{ width: 200 }}>
          <Select.Option value="IndexedDB">IndexedDB</Select.Option>
          <Select.Option value="InMemory">InMemory</Select.Option>
          <Select.Option value="FileIndexSystem">FileIndexSystem</Select.Option>
          <Select.Option value="DynamicRequest">DynamicRequest</Select.Option>
          <Select.Option value="ZipFS">ZipFS</Select.Option>
          <Select.Option value="FolderAdapter">FolderAdapter</Select.Option>
          <Select.Option value="OverlayFS">OverlayFS</Select.Option>
        </Select>
      </div>
      <div style={{ height: 'calc(100% - 48px)' }}>
        <AppRenderer
          key={fsType}
          appConfig={{
            workspaceDir: 'filesystem',
            defaultPreferences: {
              'general.theme': 'opensumi-light',
            },
          }}
          runtimeConfig={{
            workspace,
          }}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('main') as HTMLElement);

zipDataPromise.then(() => {
  root.render(<App />);
});
