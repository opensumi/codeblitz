import { LanguagesContribution, GrammarsContribution } from '@ali/ide-monaco';
import { Registry } from '@alipay/alex-registry';

export { Registry };

/**
 * @deprecated please import language by path directly
 *
 * use `import "@alipay/alex/languages/<mode>"` to import specific language.
 * use `import "@alipay/alex/languages"` to import all languages
 */
export const registerLanguage = (contrib: LanguagesContribution) => {
  Registry.register<LanguagesContribution>('language', contrib);
};

/**
 * @deprecated please import language by path directly
 *
 * use `import "@alipay/alex/languages/<mode>"` to import specific language
 * use `import "@alipay/alex/languages"` to import all languages
 */
export const registerGrammar = (contrib: GrammarsContribution) => {
  Registry.register<GrammarsContribution>('grammar', contrib);
};
