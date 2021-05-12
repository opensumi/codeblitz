import { LanguagesContribution, GrammarsContribution } from '@ali/ide-monaco';
import { centerRegistry } from '@alipay/alex-registry';

export { centerRegistry };

/**
 * @deprecated please import language by path directly
 *
 * use `import "@alipay/alex/languages/<mode>"` to import specific language.
 * use `import "@alipay/alex/languages"` to import all languages
 */
export const registerLanguage = (contrib: LanguagesContribution) => {
  centerRegistry.register<LanguagesContribution>('language', contrib);
};

/**
 * @deprecated please import language by path directly
 *
 * use `import "@alipay/alex/languages/<mode>"` to import specific language
 * use `import "@alipay/alex/languages"` to import all languages
 */
export const registerGrammar = (contrib: GrammarsContribution) => {
  centerRegistry.register<GrammarsContribution>('grammar', contrib);
};
