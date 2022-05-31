// 确保语言包先加载
import '@opensumi/ide-i18n/lib/browser';
import { registerLocalizationBundle, setLanguageId } from '@opensumi/ide-core-common';

import chinese from './zh-cn';
import english from './en-us';

import { getLocale } from '../utils/locale';

/**
 * 因为语言需要很早时机获取，比如 monaco editor 的加载
 * 因此目前跟 antcode 约定从 cookie 里面读取
 */
setLanguageId(getLocale());
registerLocalizationBundle(chinese);
registerLocalizationBundle(english);
