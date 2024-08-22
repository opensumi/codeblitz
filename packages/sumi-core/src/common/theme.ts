import { IExtensionBasicMetadata } from '@codeblitzjs/ide-common';
import { BuiltinTheme, getThemeId, getThemeType, IThemeContribution } from '@opensumi/ide-theme';

const builtinTheme = {
  "opensumi-design-dark-theme": "vs-dark",
  "opensumi-design-light-theme": "vs",
} as Record<string, BuiltinTheme>

export const getThemeTypeByPreferenceThemeId = (
  themeId: string,
  extensionMetadata: IExtensionBasicMetadata[] | undefined,
) => {
  let uiTheme: BuiltinTheme | undefined;
  if (themeId && extensionMetadata) {
    for (const ext of extensionMetadata) {
      const theme: IThemeContribution | undefined = ext.packageJSON.contributes?.themes?.find(
        (contrib: IThemeContribution) => contrib && getThemeId(contrib) === themeId,
      );

      if (theme?.uiTheme) {
        uiTheme = theme.uiTheme;
        break;
      }
    }
  }
  if (builtinTheme[themeId]) {
    uiTheme = builtinTheme[themeId];
  }

  return getThemeType(uiTheme || 'vs-dark');
};
