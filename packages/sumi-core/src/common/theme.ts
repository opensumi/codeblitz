import { IExtensionBasicMetadata } from "@codeblitzjs/ide-common";
import { BuiltinTheme, IThemeContribution, getThemeId, getThemeType } from "@opensumi/ide-theme";

export const getThemeTypeByPreferenceThemeId = (
  themeId: string,
  extensionMetadata: IExtensionBasicMetadata[] | undefined
) => {
  let uiTheme: BuiltinTheme | undefined;
  if (themeId && extensionMetadata) {
    for (const ext of extensionMetadata) {
      const theme: IThemeContribution | undefined = ext.packageJSON.contributes?.themes?.find(
        (contrib: IThemeContribution) => contrib && getThemeId(contrib) === themeId
      );

      if (theme?.uiTheme) {
        uiTheme = theme.uiTheme;
        break;
      }
    }
  }
  return getThemeType(uiTheme || 'vs-dark');
};