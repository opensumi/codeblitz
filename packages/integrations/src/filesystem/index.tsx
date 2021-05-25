import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { AppRenderer, BrowserFSFileType as FileType, IAppRendererProps } from '@alipay/alex';
import '@alipay/alex/languages';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';

const App = () => {
  const [zipData, setZipData] = useState<Buffer | null>(null);
  const [fsType, setFsType] = useState<string>('');

  useEffect(() => {
    (async () => {
      const res = await fetch(
        'http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/green-trail-test/dc85f34d-2467-436b-a0fe-092133ead0d6/demo.zip'
      );
      const buf = await res.arrayBuffer();
      setZipData(Buffer.from(new Uint8Array(buf)));
    })();
  }, []);

  const workspace = useMemo<IAppRendererProps['runtimeConfig']['workspace']>(() => {
    if (fsType === 'ZipFS' && zipData) {
      return {
        filesystem: {
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
        },
      };
    }
    if (fsType === 'DynamicRequest') {
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

      return {
        filesystem: {
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
      };
    }
  }, [fsType, zipData]);

  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: 32, display: 'flex', alignItems: 'center' }}>
        <Button size="small" onClick={() => setFsType('ZipFS')}>
          ZipFS
        </Button>
        <Button size="small" style={{ marginLeft: 8 }} onClick={() => setFsType('DynamicRequest')}>
          DynamicRequest
        </Button>
      </div>
      <div style={{ height: 'calc(100% - 32px)' }}>
        <AppRenderer
          key={fsType}
          appConfig={{
            workspaceDir: 'filesystem',
          }}
          runtimeConfig={{
            biz: 'filesystem',
            workspace,
          }}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('main'));
