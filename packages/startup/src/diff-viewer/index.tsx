import React, { useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '@codeblitzjs/ide-core/languages';
import { IPartialEditEvent } from '@opensumi/ide-ai-native/lib/browser/widget/inline-stream-diff/live-preview.decoration';

import '../index.css';
import { DiffViewerRenderer } from '@codeblitzjs/ide-core/lib/api/renderDiffViewer';
import { IDiffViewerHandle } from '@codeblitzjs/ide-core/lib/core/diff-viewer';

const data = [
  {
    path: 'app/web/src/main/java/com/alipay/archcompass/web/controller/invalidanalysis/InValidAssetsController.java',
    oldCode:
      '@GetMapping(value = "/queryInvalidRpcTree")\n    public ArchCompassResponse queryInvalidRpcTree(String reportId, String invalidFlag) {\n        return ArchCompassServiceTemplate.execute(new ArchCompassServiceCallBack<InvalidResultInfo>() {\n\n            @Override\n            public void beforeProcess() {\n                ParamCheckHelper.notBlank(reportId, "reportId");\n                ParamCheckHelper.notBlank(invalidFlag, "invalidFlag");\n            }\n\n            @Override\n            public InvalidResultInfo process() {\n                return inValidAssetsAnalysisService.queryInvalidTree(reportId, invalidFlag, "RPC");\n            }\n\n            @Override\n            public void afterProcess() {\n\n            }\n        }, "queryInvalidRpcTree");\n    }',
    newCode:
      '@GetMapping(value = "/queryInvalidRpcTree")\n    public ArchCompassResponse queryInvalidRpcTree(String reportId) {\n        return ArchCompassServiceTemplate.execute(new ArchCompassServiceCallBack<InvalidResultInfo>() {\n\n            @Override\n            public void beforeProcess() {\n                ParamCheckHelper.notBlank(reportId, "reportId");\n            }\n\n            @Override\n            public InvalidResultInfo process() {\n                return inValidAssetsAnalysisService.queryInvalidTree(reportId, "RPC");\n            }\n\n            @Override\n            public void afterProcess() {\n\n            }\n        }, "queryInvalidRpcTree");\n    }',
    fileName: 'InValidAssetsController.java',
    type: 'modify',
  },
];

const App = () => {
  const handleRef = useRef<IDiffViewerHandle | null>(null);
  const [eventInfo, setEventInfo] = React.useState<IPartialEditEvent | null>(null);

  const memo = useMemo(() => (
    <DiffViewerRenderer
      onRef={(handle) => {
        handleRef.current = handle;
        console.log('=====', handle);
        handle.onPartialEditEvent((e) => {
          console.log('onPartialEditEvent', e);
          setEventInfo(e);
        });
        handleRef.current.openDiffInTab(
          data[0].path,
          data[0].oldCode,
          data[0].newCode,
        );
      }}
    />
  ), []);

  const header = useMemo(() => (
    <div
      style={{
        height: 'fit-content',
        width: '30vw',
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
        满江红
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
      {/* {header} */}
      {memo}
    </div>
  );
};

const root = createRoot(document.getElementById('main') as HTMLElement);
root.render(<App />);
