import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Injector } from '@ali/common-di';
import { URI } from '@ali/ide-core-common';
import { join } from '@ali/ide-core-common/lib/path';
import { equals } from '@ali/ide-core-common/lib/arrays';
import {
  RuntimeConfig,
  codeServiceEditor,
  MonacoCodeService,
  IMonacoCodeService,
} from '@alipay/alex-core';
// internal patched
import { disposeMode } from '@alipay/alex/lib/core/patch';

import { ConfigProvider } from 'antd';

import render from './app';
import {
  IAntcodeService,
  IAntcodeCRProps,
  IPullRequestChangeDiff,
} from './modules/antcode-service/base';
import { AntcodeService } from './modules/antcode-service';
import { WorkspaceManagerService } from './modules/workspace/workspace-loader.service';

import { getLocale } from './utils/locale';

import styles from './styles.module.less';
import { logPv } from './utils/tracert';
import { RootElementId } from './constant';
import { Portals } from './portal';
import { reportUserAccess } from './utils/monitor';
import { CommentsZoneWidgetPatch, CommentsZoneWidget } from './overrides/comments-zone.view';

const { version } = require('../package.json');

const AntcodeCR: React.FC<IAntcodeCRProps> = (props) => {
  const container$ = React.useRef<HTMLDivElement>(null);
  const injector$ = React.useRef<Injector>(null);

  // 标记开始渲染的时间
  const renderStart = React.useMemo(() => performance.now(), []);
  React.useEffect(() => {
    const injector = new Injector();

    // @ts-ignore
    injector$.current = injector;
    if (container$.current) {
      const workspaceDir = WorkspaceManagerService.getWorkspaceDir(
        props.projectId,
        props.pr.id,
        props.nextSha
      ).codeUri.fsPath;

      injector.addProviders(
        {
          token: IAntcodeService,
          useValue: injector.get(AntcodeService, [{ ...props, renderStart }]),
        },
        {
          token: RuntimeConfig,
          useValue: {},
        },
        {
          token: MonacoCodeService,
          useValue: codeServiceEditor,
        },
        {
          token: IMonacoCodeService,
          useClass: MonacoCodeService,
          override: true,
        },
        {
          token: CommentsZoneWidget,
          useClass: CommentsZoneWidgetPatch,
        }
      );

      render(
        injector,
        workspaceDir,
        (app: React.FC) => {
          return new Promise((resolve) => {
            ReactDOM.render(
              // @ts-ignore
              <ConfigProvider>{app}</ConfigProvider>,
              container$.current,
              resolve
            );
          });
        },
        {
          extraContextProvider: props.extraContextProvider,
          staticServicePath: new URI(window.location.href)
            .withPath(join(props.projectPath, 'raw'))
            .toString(),
        },
        {
          // 因为 clientApp 启动时会再次从 preference 读取并设置 language
          // 因此这里还需要额外设置一把
          'general.language': getLocale().toLocaleLowerCase(),
        }
      );
    }

    // 保持 codeServiceEditor 单例，且组件每次实例化重新赋值
    const clearInjector = codeServiceEditor.setInjector(injector);

    // spm 曝光埋点
    logPv('a1654', 'b23008');
    // 记录用户访问信息，包括 pr 维度的 pv, uv
    reportUserAccess({
      projectId: props.projectId,
      prId: props.pr?.iid,
      pullRequestId: props.pr?.id,
    });

    // 卸载掉组件
    return () => {
      const realInjector = injector$.current;
      if (realInjector) {
        disposeMode();
        clearInjector();
        realInjector.disposeAll();
      }
      ReactDOM.unmountComponentAtNode(container$!.current!);
    };
  }, []);

  // sha listener
  React.useEffect(() => {
    const antCodeService: IAntcodeService = injector$!.current!.get(IAntcodeService);
    if (props.prevSha !== antCodeService.leftRef) {
      antCodeService.leftRef = props.prevSha;
    }

    if (props.nextSha !== antCodeService.rightRef) {
      antCodeService.rightRef = props.nextSha;
    }
  }, [props.prevSha, props.nextSha]);

  // latest sha listener
  React.useEffect(() => {
    // @ts-ignore
    const antCodeService: IAntcodeService = injector$.current.get(IAntcodeService);
    if (props.latestCommitSha !== antCodeService.latestCommitSha) {
      antCodeService.latestCommitSha = props.latestCommitSha;
    }
  }, [props.latestCommitSha]);

  // line_count listener
  React.useEffect(() => {
    // @ts-ignore
    const antCodeService: IAntcodeService = injector$.current.get(IAntcodeService);
    if (props.addLineNum !== antCodeService.addLineNum) {
      antCodeService.addLineNum = props.addLineNum;
    }

    if (props.deleteLineNum !== antCodeService.deleteLineNum) {
      antCodeService.deleteLineNum = props.deleteLineNum;
    }
  }, [props.addLineNum, props.deleteLineNum]);

  // diffs listener
  React.useEffect(() => {
    // @ts-ignore
    const antCodeService: IAntcodeService = injector$.current.get(IAntcodeService);
    if (!equals(props.diffs as any, antCodeService.pullRequestChangeList as any)) {
      antCodeService.pullRequestChangeList = props.diffs as IPullRequestChangeDiff[];
    }
  }, [props.diffs]);

  React.useEffect(() => {
    // @ts-ignore
    const antCodeService: IAntcodeService = injector$.current.get(IAntcodeService);
    antCodeService.noteIdToNote = props.noteIdToNote;
  }, [props.noteUpdateFlag]);

  // pullRequest listener
  React.useEffect(() => {
    // @ts-ignore
    const antCodeService: IAntcodeService = injector$.current.get(IAntcodeService);
    antCodeService.pullRequest = props.pr;
  }, [props.pr]);

  React.useEffect(() => {
    // @ts-ignore
    const antCodeService: IAntcodeService = injector$.current.get(IAntcodeService);
    antCodeService.updateConfig({ getFileContent: props.getFileContent });
  }, [props.getFileContent]);

  React.useEffect(() => {
    // @ts-ignore
    const antCodeService: IAntcodeService = injector$.current.get(IAntcodeService);
    antCodeService.getDiffById = props.getDiffById;
  }, [props.getDiffById]);

  React.useEffect(() => {
    // console.log(props.encoding)
    // @ts-ignore
    const antCodeService: IAntcodeService = injector$.current.get(IAntcodeService);
    antCodeService.fireEncodingChange(props.encoding);
  }, [props.encoding]);

  const portalComponents = React.useMemo(
    () => [
      props.AnnotationEntry,
      props.Commenting,
      props.DiscussionItem,
      props.Menubar,
      props.PRMoreActionLinks,
    ],
    []
  );
  // fileReadMarkChange listener
  props.fileReadMarkChange$.useSubscription((newPath: string) => {
    // @ts-ignore
    const antCodeService: IAntcodeService = injector$.current.get(IAntcodeService);
    antCodeService.didViewChangeEmitter.fire(newPath);
  });

  // `isFullscreen` listener
  React.useEffect(() => {
    // @ts-ignore
    const antCodeService: IAntcodeService = injector$.current.get(IAntcodeService);
    antCodeService.isFullscreen = props.isFullscreen;
  }, [props.isFullscreen]);

  // should listen to methods???
  return (
    // @ts-ignore
    <Portals components={portalComponents}>
      <div
        className={styles.container}
        ref={container$}
        id={RootElementId}
        data-meta-version={version}
      />
    </Portals>
  );
};

export default AntcodeCR;
