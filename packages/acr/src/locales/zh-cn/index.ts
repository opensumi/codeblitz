import acrSettings from './acr-settings';
import codeReview from './code-review';
import changesTree from './changes-tree';
import misc from './misc';
import editorBottomSide from './editor-bottom-side';
import webScm from './web-scm';
import commands from './commands';

export default {
  languageId: 'zh-CN',
  languageName: 'Chinese',
  localizedLanguageName: '中文(中国)',
  contents: {
    'acr.common.on': '开',
    'acr.common.off': '关',
    'acr.common.skip': '跳过',
    'acr.common.read-only': '只读',
    ...acrSettings,
    ...commands,
    ...codeReview,
    ...changesTree,
    ...misc,
    ...editorBottomSide,
    ...webScm,
  },
};
