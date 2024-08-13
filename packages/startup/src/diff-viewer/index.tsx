import { IPartialEditEvent } from '@opensumi/ide-ai-native/lib/browser/widget/inline-stream-diff/live-preview.decoration';
import React, { useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import '../index.css';
import { DiffViewerRenderer } from '@codeblitzjs/ide-core/lib/api/renderDiffViewer';
import { IDiffViewerHandle } from '@codeblitzjs/ide-core/lib/core/diff-viewer';
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

const App = () => {
  const handleRef = useRef<IDiffViewerHandle | null>(null);
  const [eventInfo, setEventInfo] = React.useState<any | null>(null);

  const memo = useMemo(() => (
    <DiffViewerRenderer
      tabBarRightExtraContent={{
        component: () => <div>hello</div>,
      }}
      appConfig={{
        layoutViewSize: {
          editorTabsHeight: 50
        }
      }}
      onWillApplyTheme={() => {
        return {
          'editorGroupHeader.tabsBackground': '#ECF1FE',
          'editor.background': '#fff',
          'aiNative.inlineDiffAddedRange': '#26bf6d1f',
          'aiNative.inlineDiffRemovedRange': "#ff4d4f1e",
          'aiNative.inlineDiffAcceptPartialEdit': '#26bf6d80',
          'aiNative.inlineDiffDiscardPartialEdit': '#ff4d4f80',
          'aiNative.inlineDiffAcceptPartialEdit.foreground': '#000',
        };
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
        data.forEach(v => {
          handleRef.current!.openDiffInTab(
            v.path,
            v.oldCode,
            v.newCode,
          );
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
    </div>
  );
};

const root = createRoot(document.getElementById('main') as HTMLElement);
root.render(<App />);
