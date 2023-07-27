import { LanguagesContribution, GrammarsContribution } from '@opensumi/ide-monaco';
import { Registry } from '@codeblitzjs/ide-registry';

export { Registry };

/**
 * @deprecated please import language by path directly
 *
 * use `import "@codeblitzjs/ide-core/languages/<mode>"` to import specific language.
 * use `import "@codeblitzjs/ide-core/languages"` to import all languages
 */
export const registerLanguage = (contrib: LanguagesContribution) => {
  Registry.register<LanguagesContribution>('language', contrib);
};

/**
 * @deprecated please import language by path directly
 *
 * use `import "@codeblitzjs/ide-core/languages/<mode>"` to import specific language
 * use `import "@codeblitzjs/ide-core/languages"` to import all languages
 */
export const registerGrammar = (contrib: GrammarsContribution) => {
  Registry.register<GrammarsContribution>('grammar', contrib);
};
