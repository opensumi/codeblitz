import acrSettings from './acr-settings';
import codeReview from './code-review';
import changesTree from './changes-tree';
import misc from './misc';
import editorBottomSide from './editor-bottom-side';
import webScm from './web-scm';
import commands from './commands';

export default {
  languageId: 'en-US',
  languageName: 'English',
  localizedLanguageName: 'English(United States)',
  contents: {
    'acr.common.on': 'On',
    'acr.common.off': 'Off',
    'acr.common.skip': 'Skip',
    'acr.common.read-only': 'ReadOnly',
    ...acrSettings,
    ...commands,
    ...codeReview,
    ...changesTree,
    ...misc,
    ...editorBottomSide,
    ...webScm,
  },
};
