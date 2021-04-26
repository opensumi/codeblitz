import React from 'react';
import ReactDOM from 'react-dom';
import jCookie from 'js-cookie';
import qs from 'query-string';

import AntcodeCR from '@alipay/acr-ide';
import { getLocale } from '@alipay/acr-ide/lib/utils/locale';
import { IAntcodeCRProps } from '@alipay/acr-ide/lib/modules/antcode-service/base';
import { AntcodeEncodingType } from '@alipay/acr-ide/lib/modules/antcode-service/base';

import { getProps } from './mock-props';
import { getPrDetail, getPrChanges, getDiffById } from './mock-props/requests';
import * as meta from './mock-props/meta';

import './styles.less';

const query = qs.parse(window.location.search);

const projectId = (query.projectId || meta.defaultProjectId) as number;
const projectPath = (query.projectPath || meta.defaultProjectPath) as string;
const prIid = (query.prIid || meta.defaultPrIid) as number;

const STABLE_PROPS = getProps(projectId);

const App = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [encoding, setEncoding] = React.useState<AntcodeEncodingType>(meta.defaultEncoding);

  const [lang] = React.useState<string>(() => getLocale());
  const setLanguage = React.useCallback(() => {
    jCookie.set('LOCALE', lang === 'en-US' ? 'zh_CN' : 'en_US');
    window.location.reload();
  }, [lang]);

  const [prData, setPrData] = React.useState({
    prDetail: {} as any,
    prChanges: [],
    isReady: false,
  });

  // handle query
  React.useEffect(() => {
    getPrDetail(projectId, prIid).then((prDetail) => {
      console.log(prDetail, 'prDetail');
      setPrData((r) => ({
        ...r,
        isReady: true,
        prDetail,
      }));
      getPrChanges(projectId, prDetail.id).then((prChanges) => {
        setPrData((r) => ({
          ...r,
          prChanges,
        }));
      });
    });
  }, []);

  if (!prData.isReady) {
    return null;
  }

  console.log(encoding, 'encoding');

  const props = {
    ...STABLE_PROPS,
    encoding,
    setEncoding,
    locale: lang,
    pr: prData.prDetail,
    diffs: prData.prChanges,
    prevSha: prData.prDetail.diff.baseCommitSha,
    nextSha: prData.prDetail.diff.headCommitSha,
    latestCommitSha: prData.prDetail.diff.headCommitSha,
    projectId,
    projectPath,
    getDiffById: (changeId: number) => {
      return getDiffById(projectId, prData.prDetail.id, changeId);
    },
  } as IAntcodeCRProps;

  return (
    <div style={{ height: '100%' }}>
      <div>
        <button onClick={() => setVisible((r) => !r)}>destroy by toggle</button>
        <button onClick={setLanguage}>toggle lang: current lang {lang}</button>
      </div>
      <div className="ide">{visible && <AntcodeCR {...props} />}</div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('main')!);
