import React, { useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import '../index.css';
import { DiffViewerRenderer } from '@codeblitzjs/ide-core/lib/api/renderDiffViewer';
import { IDiffViewerHandle } from '@codeblitzjs/ide-core/lib/core/diff-viewer';
import { SumiReadableStream } from '@opensumi/ide-utils/lib/stream';
import splitRetain from 'split-retain';
import { ModelWrapper } from '../code/code';
import { overrideColorTokens } from '../common/constants';
import jsonData from './data.json';

const data = [
  {
    path: 'app/web/src/main/java/com/alipay/archcompass/web/controller/invalidanalysis/InValidAssetsController.java',
    oldCode:
      '// 1234123\n//1235123123@GetMapping(value = "/queryInvalidRpcTree")\n    public ArchCompassResponse queryInvalidRpcTree(String reportId, String invalidFlag) {\n        return ArchCompassServiceTemplate.execute(new ArchCompassServiceCallBack<InvalidResultInfo>() {\n\n            @Override\n            public void beforeProcess() {\n                ParamCheckHelper.notBlank(reportId, "reportId");\n                ParamCheckHelper.notBlank(invalidFlag, "invalidFlag");\n            }\n\n            @Override\n            public InvalidResultInfo process() {\n                return inValidAssetsAnalysisService.queryInvalidTree(reportId, invalidFlag, "RPC");\n            }\n\n            @Override\n            public void afterProcess() {\n\n            }\n        }, "queryInvalidRpcTree");\n    }',
    newCode:
      '@GetMapping(value = "/queryInvalidRpcTree")\n    public ArchCompassResponse queryInvalidRpcTree(String reportId) {\n        return ArchCompassServiceTemplate.execute(new ArchCompassServiceCallBack<InvalidResultInfo>() {\n\n            @Override\n            public void beforeProcess() {\n                ParamCheckHelper.notBlank(reportId, "reportId");\n            }\n\n            @Override\n            public InvalidResultInfo process() {\n                return inValidAssetsAnalysisService.queryInvalidTree(reportId, "RPC");\n            }\n\n            @Override\n            public void afterProcess() {\n\n            }\n        }, "queryInvalidRpcTree");\n    }',
  },
  {
    path: 'app/web/src/main/java/com/alipay/archcompass/web/controller/invalidanalysis/InValidAssetsController1.java',
    oldCode:
      '// aaasd@GetMapping(value = "/hahahhaha")\n    public ArchCompassResponse hahahhaha(String reportId, String invalidFlag) {\n        return ArchCompassServiceTemplate.execute(new ArchCompassServiceCallBack<InvalidResultInfo>() {\n\n            @Override\n            public void beforeProcess() {\n                ParamCheckHelper.notBlank(reportId, "reportId");\n                ParamCheckHelper.notBlank(invalidFlag, "invalidFlag");\n            }\n\n            @Override\n            public InvalidResultInfo process() {\n                return inValidAssetsAnalysisService.queryInvalidTree(reportId, invalidFlag, "RPC");\n            }\n\n            @Override\n            public void afterProcess() {\n\n            }\n        }, "hahahhaha");\n    }',
    newCode:
      '@GetMapping(value = "/hahahhaha")\n    public ArchCompassResponse hahahhaha(String reportId) {\n        return ArchCompassServiceTemplate.execute(new ArchCompassServiceCallBack<InvalidResultInfo>() {\n\n            @Override\n            public void beforeProcess() {\n                ParamCheckHelper.notBlank(reportId, "reportId");\n            }\n\n            @Override\n            public InvalidResultInfo process() {\n                return inValidAssetsAnalysisService.queryInvalidTree(reportId, "RPC");\n            }\n\n            @Override\n            public void afterProcess() {\n\n            }\n        }, "hahahhaha");\n    }',
  },
  {
    path: 'src/index.ts',
    oldCode: 'console.log("hello world");\nconsole.log("second line");\nconsole.log("third line");',
    newCode: 'console.log("hello world");\nconsole.log("second line changed");\nconsole.log("third line");',
  },
] as any[];

data.push(...jsonData);

function createMockStream(data: string) {
  const streamData = splitRetain(data, '\n');
  const length = streamData.length;
  const chatReadableStream = new SumiReadableStream<string>();

  streamData.forEach((chunk, index) => {
    setTimeout(() => {
      chatReadableStream.emitData(chunk.toString());

      if (length - 1 === index) {
        chatReadableStream.end();
      }
    }, index * 100);
  });

  return chatReadableStream;
}

const App = () => {
  const handleRef = useRef<IDiffViewerHandle | null>(null);
  const [eventInfo, setEventInfo] = React.useState<any | null>(null);

  const memo = useMemo(() => (
    <DiffViewerRenderer
      data={data}
      tabBarRightExtraContent={{
        component: () => <div>代码生成中</div>,
      }}
      appConfig={{
        layoutViewSize: {},
      }}
      onWillApplyTheme={() => {
        return overrideColorTokens;
      }}
      onRef={(handle) => {
        handleRef.current = handle;
        console.log('=====', handle);
        handle.onPartialEditEvent((e) => {
          console.log('onPartialEditEvent', e);
          setEventInfo(e);
        });
        handle.onDidTabChange((e) => {
          console.log('onDidTabChange', e.newPath);
          setEventInfo(e);
        });

        setTimeout(() => {
          const currentTab = handleRef.current!.getCurrentTab();
          console.log(`🚀 ~ setTimeout ~ currentTab:`, currentTab);

          const tab0 = handleRef.current!.getTabAtIndex(0);
          console.log(`🚀 ~ setTimeout ~ tab0:`, tab0);

          const allTabs = handleRef.current!.getAllTabs();
          console.log(`🚀 ~ setTimeout ~ allTabs:`, allTabs);
        }, 5000);
      }}
    />
  ), []);
  let [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const header = useMemo(() => (
    <div
      style={{
        height: 'fit-content',
        width: '20vw',
        minWidth: '20vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <button
        onClick={() => {
          if (!handleRef.current) return;
          handleRef.current.openDiffInTab(
            data[0].path,
            data[0].oldCode,
            data[0].newCode,
          );
        }}
      >
        Java 代码
      </button>
      <button
        onClick={() => {
          if (!handleRef.current) return;
          handleRef.current.openDiffInTab(
            data[1].path,
            data[1].oldCode,
            data[1].newCode,
          );
        }}
      >
        TypeScript
      </button>
      <button
        onClick={() => {
          if (!handleRef.current) return;
          handleRef.current.acceptAllPartialEdit();
        }}
      >
        accept all
      </button>
      <button
        onClick={() => {
          if (!handleRef.current) return;
          handleRef.current.rejectAllPartialEdit();
        }}
      >
        reject all
      </button>
      <button
        onClick={() => {
          data.forEach((item) => {
            if (!handleRef.current) return;
            handleRef.current.openDiffInTab(
              item.path,
              item.oldCode,
              item.newCode,
              {
                overwriteOldCode: true,
              },
            );
          });
        }}
      >
        reset
      </button>
      <button
        onClick={() => {
          if (!handleRef.current) return;
          const item = data[data.length - 1];
          handleRef.current.openDiffInTabByStream(item.path, item.oldCode, createMockStream(item.newCode));
        }}
      >
        流式
      </button>

      {data.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              if (!handleRef.current) return;
              handleRef.current.openTab(
                item.path,
              );
            }}
          >
            {item.path.split('/').pop()}
          </button>
        );
      })}
      <button
        onClick={() => {
          if (!handleRef.current) return;
          const currentTab = handleRef.current.getCurrentTab();
          console.log(`🚀 ~ setTimeout ~ currentTab:`, currentTab);
          setEventInfo(currentTab);
        }}
      >
        Current Tab
      </button>
      <button
        onClick={() => {
          setModalOpen(true);
        }}
      >
        打开弹层
      </button>
      <p>
        {eventInfo ? JSON.stringify(eventInfo, null, 2) : 'no event'}
      </p>
    </div>
  ), [eventInfo]);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
      }}
    >
      {header}
      {memo}
      <ModelWrapper
        value={modalOpen}
        onChange={(v) => {
          setModalOpen(v);
        }}
      />
    </div>
  );
};

const root = createRoot(document.getElementById('main') as HTMLElement);
root.render(<App />);
