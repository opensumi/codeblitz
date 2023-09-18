module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "css-language-features-worker",
    "version": "1.53.0-patch.1"
  },
  "packageJSON": {
    "name": "css-language-features-worker",
    "publisher": "alex",
    "version": "1.53.0-patch.1",
    "displayName": "%displayName%",
    "description": "%description%",
    "icon": "icons/css.png",
    "activationEvents": [
      "onLanguage:css",
      "onLanguage:less",
      "onLanguage:scss",
      "onCommand:_css.applyCodeAction"
    ],
    "sumiContributes": {
      "workerMain": "client/dist/browser/cssClientMain.js"
    },
    "contributes": {
      "configuration": [
        {
          "order": 22,
          "id": "css",
          "title": "%css.title%",
          "properties": {
            "css.customData": {
              "type": "array",
              "markdownDescription": "%css.customData.desc%",
              "default": [],
              "items": {
                "type": "string"
              },
              "scope": "resource"
            },
            "css.completion.triggerPropertyValueCompletion": {
              "type": "boolean",
              "scope": "resource",
              "default": true,
              "description": "%css.completion.triggerPropertyValueCompletion.desc%"
            },
            "css.completion.completePropertyWithSemicolon": {
              "type": "boolean",
              "scope": "resource",
              "default": true,
              "description": "%css.completion.completePropertyWithSemicolon.desc%"
            },
            "css.validate": {
              "type": "boolean",
              "scope": "resource",
              "default": true,
              "description": "%css.validate.desc%"
            },
            "css.lint.compatibleVendorPrefixes": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%css.lint.compatibleVendorPrefixes.desc%"
            },
            "css.lint.vendorPrefix": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%css.lint.vendorPrefix.desc%"
            },
            "css.lint.duplicateProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%css.lint.duplicateProperties.desc%"
            },
            "css.lint.emptyRules": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%css.lint.emptyRules.desc%"
            },
            "css.lint.importStatement": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%css.lint.importStatement.desc%"
            },
            "css.lint.boxModel": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%css.lint.boxModel.desc%"
            },
            "css.lint.universalSelector": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%css.lint.universalSelector.desc%"
            },
            "css.lint.zeroUnits": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%css.lint.zeroUnits.desc%"
            },
            "css.lint.fontFaceProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "markdownDescription": "%css.lint.fontFaceProperties.desc%"
            },
            "css.lint.hexColorLength": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "error",
              "description": "%css.lint.hexColorLength.desc%"
            },
            "css.lint.argumentsInColorFunction": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "error",
              "description": "%css.lint.argumentsInColorFunction.desc%"
            },
            "css.lint.unknownProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%css.lint.unknownProperties.desc%"
            },
            "css.lint.validProperties": {
              "type": "array",
              "uniqueItems": true,
              "items": {
                "type": "string"
              },
              "scope": "resource",
              "default": [],
              "description": "%css.lint.validProperties.desc%"
            },
            "css.lint.ieHack": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%css.lint.ieHack.desc%"
            },
            "css.lint.unknownVendorSpecificProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%css.lint.unknownVendorSpecificProperties.desc%"
            },
            "css.lint.propertyIgnoredDueToDisplay": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "markdownDescription": "%css.lint.propertyIgnoredDueToDisplay.desc%"
            },
            "css.lint.important": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%css.lint.important.desc%"
            },
            "css.lint.float": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%css.lint.float.desc%"
            },
            "css.lint.idSelector": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%css.lint.idSelector.desc%"
            },
            "css.lint.unknownAtRules": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%css.lint.unknownAtRules.desc%"
            },
            "css.trace.server": {
              "type": "string",
              "scope": "window",
              "enum": [
                "off",
                "messages",
                "verbose"
              ],
              "default": "off",
              "description": "%css.trace.server.desc%"
            }
          }
        },
        {
          "id": "scss",
          "order": 24,
          "title": "%scss.title%",
          "properties": {
            "scss.completion.triggerPropertyValueCompletion": {
              "type": "boolean",
              "scope": "resource",
              "default": true,
              "description": "%scss.completion.triggerPropertyValueCompletion.desc%"
            },
            "scss.completion.completePropertyWithSemicolon": {
              "type": "boolean",
              "scope": "resource",
              "default": true,
              "description": "%scss.completion.completePropertyWithSemicolon.desc%"
            },
            "scss.validate": {
              "type": "boolean",
              "scope": "resource",
              "default": true,
              "description": "%scss.validate.desc%"
            },
            "scss.lint.compatibleVendorPrefixes": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%scss.lint.compatibleVendorPrefixes.desc%"
            },
            "scss.lint.vendorPrefix": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%scss.lint.vendorPrefix.desc%"
            },
            "scss.lint.duplicateProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%scss.lint.duplicateProperties.desc%"
            },
            "scss.lint.emptyRules": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%scss.lint.emptyRules.desc%"
            },
            "scss.lint.importStatement": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%scss.lint.importStatement.desc%"
            },
            "scss.lint.boxModel": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%scss.lint.boxModel.desc%"
            },
            "scss.lint.universalSelector": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%scss.lint.universalSelector.desc%"
            },
            "scss.lint.zeroUnits": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%scss.lint.zeroUnits.desc%"
            },
            "scss.lint.fontFaceProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "markdownDescription": "%scss.lint.fontFaceProperties.desc%"
            },
            "scss.lint.hexColorLength": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "error",
              "description": "%scss.lint.hexColorLength.desc%"
            },
            "scss.lint.argumentsInColorFunction": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "error",
              "description": "%scss.lint.argumentsInColorFunction.desc%"
            },
            "scss.lint.unknownProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%scss.lint.unknownProperties.desc%"
            },
            "scss.lint.validProperties": {
              "type": "array",
              "uniqueItems": true,
              "items": {
                "type": "string"
              },
              "scope": "resource",
              "default": [],
              "description": "%scss.lint.validProperties.desc%"
            },
            "scss.lint.ieHack": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%scss.lint.ieHack.desc%"
            },
            "scss.lint.unknownVendorSpecificProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%scss.lint.unknownVendorSpecificProperties.desc%"
            },
            "scss.lint.propertyIgnoredDueToDisplay": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "markdownDescription": "%scss.lint.propertyIgnoredDueToDisplay.desc%"
            },
            "scss.lint.important": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%scss.lint.important.desc%"
            },
            "scss.lint.float": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%scss.lint.float.desc%"
            },
            "scss.lint.idSelector": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%scss.lint.idSelector.desc%"
            },
            "scss.lint.unknownAtRules": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%scss.lint.unknownAtRules.desc%"
            }
          }
        },
        {
          "id": "less",
          "order": 23,
          "type": "object",
          "title": "%less.title%",
          "properties": {
            "less.completion.triggerPropertyValueCompletion": {
              "type": "boolean",
              "scope": "resource",
              "default": true,
              "description": "%less.completion.triggerPropertyValueCompletion.desc%"
            },
            "less.completion.completePropertyWithSemicolon": {
              "type": "boolean",
              "scope": "resource",
              "default": true,
              "description": "%less.completion.completePropertyWithSemicolon.desc%"
            },
            "less.validate": {
              "type": "boolean",
              "scope": "resource",
              "default": true,
              "description": "%less.validate.desc%"
            },
            "less.lint.compatibleVendorPrefixes": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%less.lint.compatibleVendorPrefixes.desc%"
            },
            "less.lint.vendorPrefix": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%less.lint.vendorPrefix.desc%"
            },
            "less.lint.duplicateProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%less.lint.duplicateProperties.desc%"
            },
            "less.lint.emptyRules": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%less.lint.emptyRules.desc%"
            },
            "less.lint.importStatement": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%less.lint.importStatement.desc%"
            },
            "less.lint.boxModel": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%less.lint.boxModel.desc%"
            },
            "less.lint.universalSelector": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%less.lint.universalSelector.desc%"
            },
            "less.lint.zeroUnits": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%less.lint.zeroUnits.desc%"
            },
            "less.lint.fontFaceProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "markdownDescription": "%less.lint.fontFaceProperties.desc%"
            },
            "less.lint.hexColorLength": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "error",
              "description": "%less.lint.hexColorLength.desc%"
            },
            "less.lint.argumentsInColorFunction": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "error",
              "description": "%less.lint.argumentsInColorFunction.desc%"
            },
            "less.lint.unknownProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%less.lint.unknownProperties.desc%"
            },
            "less.lint.validProperties": {
              "type": "array",
              "uniqueItems": true,
              "items": {
                "type": "string"
              },
              "scope": "resource",
              "default": [],
              "description": "%less.lint.validProperties.desc%"
            },
            "less.lint.ieHack": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%less.lint.ieHack.desc%"
            },
            "less.lint.unknownVendorSpecificProperties": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%less.lint.unknownVendorSpecificProperties.desc%"
            },
            "less.lint.propertyIgnoredDueToDisplay": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "markdownDescription": "%less.lint.propertyIgnoredDueToDisplay.desc%"
            },
            "less.lint.important": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%less.lint.important.desc%"
            },
            "less.lint.float": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "markdownDescription": "%less.lint.float.desc%"
            },
            "less.lint.idSelector": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "ignore",
              "description": "%less.lint.idSelector.desc%"
            },
            "less.lint.unknownAtRules": {
              "type": "string",
              "scope": "resource",
              "enum": [
                "ignore",
                "warning",
                "error"
              ],
              "default": "warning",
              "description": "%less.lint.unknownAtRules.desc%"
            }
          }
        }
      ],
      "configurationDefaults": {
        "[css]": {
          "editor.suggest.insertMode": "replace"
        },
        "[scss]": {
          "editor.suggest.insertMode": "replace"
        },
        "[less]": {
          "editor.suggest.insertMode": "replace"
        }
      },
      "jsonValidation": [
        {
          "fileMatch": "*.css-data.json",
          "url": "https://raw.githubusercontent.com/microsoft/vscode-css-languageservice/master/docs/customData.schema.json"
        },
        {
          "fileMatch": "package.json",
          "url": "./schemas/package.schema.json"
        }
      ],
      "workerMain": "client/dist/browser/cssClientMain.js"
    },
    "browser": "./client/dist/browser/cssClientMain"
  },
  "defaultPkgNlsJSON": {
    "displayName": "CSS Language Features",
    "description": "Provides rich language support for CSS, LESS and SCSS files.",
    "css.title": "CSS",
    "css.customData.desc": "A list of relative file paths pointing to JSON files following the [custom data format](https://github.com/microsoft/vscode-css-languageservice/blob/master/docs/customData.md).\n\nVS Code loads custom data on startup to enhance its CSS support for the custom CSS properties, at directives, pseudo classes and pseudo elements you specify in the JSON files.\n\nThe file paths are relative to workspace and only workspace folder settings are considered.",
    "css.completion.triggerPropertyValueCompletion.desc": "By default, VS Code triggers property value completion after selecting a CSS property. Use this setting to disable this behavior.",
    "css.completion.completePropertyWithSemicolon.desc": "Insert semicolon at end of line when completing CSS properties",
    "css.lint.argumentsInColorFunction.desc": "Invalid number of parameters.",
    "css.lint.boxModel.desc": "Do not use `width` or `height` when using `padding` or `border`.",
    "css.lint.compatibleVendorPrefixes.desc": "When using a vendor-specific prefix make sure to also include all other vendor-specific properties.",
    "css.lint.duplicateProperties.desc": "Do not use duplicate style definitions.",
    "css.lint.emptyRules.desc": "Do not use empty rulesets.",
    "css.lint.float.desc": "Avoid using `float`. Floats lead to fragile CSS that is easy to break if one aspect of the layout changes.",
    "css.lint.fontFaceProperties.desc": "`@font-face` rule must define `src` and `font-family` properties.",
    "css.lint.hexColorLength.desc": "Hex colors must consist of three or six hex numbers.",
    "css.lint.idSelector.desc": "Selectors should not contain IDs because these rules are too tightly coupled with the HTML.",
    "css.lint.ieHack.desc": "IE hacks are only necessary when supporting IE7 and older.",
    "css.lint.important.desc": "Avoid using `!important`. It is an indication that the specificity of the entire CSS has gotten out of control and needs to be refactored.",
    "css.lint.importStatement.desc": "Import statements do not load in parallel.",
    "css.lint.propertyIgnoredDueToDisplay.desc": "Property is ignored due to the display. E.g. with `display: inline`, the `width`, `height`, `margin-top`, `margin-bottom`, and `float` properties have no effect.",
    "css.lint.universalSelector.desc": "The universal selector (`*`) is known to be slow.",
    "css.lint.unknownAtRules.desc": "Unknown at-rule.",
    "css.lint.unknownProperties.desc": "Unknown property.",
    "css.lint.validProperties.desc": "A list of properties that are not validated against the `unknownProperties` rule.",
    "css.lint.unknownVendorSpecificProperties.desc": "Unknown vendor specific property.",
    "css.lint.vendorPrefix.desc": "When using a vendor-specific prefix, also include the standard property.",
    "css.lint.zeroUnits.desc": "No unit for zero needed.",
    "css.trace.server.desc": "Traces the communication between VS Code and the CSS language server.",
    "css.validate.title": "Controls CSS validation and problem severities.",
    "css.validate.desc": "Enables or disables all validations.",
    "less.title": "LESS",
    "less.completion.triggerPropertyValueCompletion.desc": "By default, VS Code triggers property value completion after selecting a CSS property. Use this setting to disable this behavior.",
    "less.completion.completePropertyWithSemicolon.desc": "Insert semicolon at end of line when completing CSS properties",
    "less.lint.argumentsInColorFunction.desc": "Invalid number of parameters.",
    "less.lint.boxModel.desc": "Do not use `width` or `height` when using `padding` or `border`.",
    "less.lint.compatibleVendorPrefixes.desc": "When using a vendor-specific prefix make sure to also include all other vendor-specific properties.",
    "less.lint.duplicateProperties.desc": "Do not use duplicate style definitions.",
    "less.lint.emptyRules.desc": "Do not use empty rulesets.",
    "less.lint.float.desc": "Avoid using `float`. Floats lead to fragile CSS that is easy to break if one aspect of the layout changes.",
    "less.lint.fontFaceProperties.desc": "`@font-face` rule must define `src` and `font-family` properties.",
    "less.lint.hexColorLength.desc": "Hex colors must consist of three or six hex numbers.",
    "less.lint.idSelector.desc": "Selectors should not contain IDs because these rules are too tightly coupled with the HTML.",
    "less.lint.ieHack.desc": "IE hacks are only necessary when supporting IE7 and older.",
    "less.lint.important.desc": "Avoid using `!important`. It is an indication that the specificity of the entire CSS has gotten out of control and needs to be refactored.",
    "less.lint.importStatement.desc": "Import statements do not load in parallel.",
    "less.lint.propertyIgnoredDueToDisplay.desc": "Property is ignored due to the display. E.g. with `display: inline`, the `width`, `height`, `margin-top`, `margin-bottom`, and `float` properties have no effect.",
    "less.lint.universalSelector.desc": "The universal selector (`*`) is known to be slow.",
    "less.lint.unknownAtRules.desc": "Unknown at-rule.",
    "less.lint.unknownProperties.desc": "Unknown property.",
    "less.lint.validProperties.desc": "A list of properties that are not validated against the `unknownProperties` rule.",
    "less.lint.unknownVendorSpecificProperties.desc": "Unknown vendor specific property.",
    "less.lint.vendorPrefix.desc": "When using a vendor-specific prefix, also include the standard property.",
    "less.lint.zeroUnits.desc": "No unit for zero needed.",
    "less.validate.title": "Controls LESS validation and problem severities.",
    "less.validate.desc": "Enables or disables all validations.",
    "scss.title": "SCSS (Sass)",
    "scss.completion.triggerPropertyValueCompletion.desc": "By default, VS Code triggers property value completion after selecting a CSS property. Use this setting to disable this behavior.",
    "scss.completion.completePropertyWithSemicolon.desc": "Insert semicolon at end of line when completing CSS properties",
    "scss.lint.argumentsInColorFunction.desc": "Invalid number of parameters.",
    "scss.lint.boxModel.desc": "Do not use `width` or `height` when using `padding` or `border`.",
    "scss.lint.compatibleVendorPrefixes.desc": "When using a vendor-specific prefix make sure to also include all other vendor-specific properties.",
    "scss.lint.duplicateProperties.desc": "Do not use duplicate style definitions.",
    "scss.lint.emptyRules.desc": "Do not use empty rulesets.",
    "scss.lint.float.desc": "Avoid using `float`. Floats lead to fragile CSS that is easy to break if one aspect of the layout changes.",
    "scss.lint.fontFaceProperties.desc": "`@font-face` rule must define `src` and `font-family` properties.",
    "scss.lint.hexColorLength.desc": "Hex colors must consist of three or six hex numbers.",
    "scss.lint.idSelector.desc": "Selectors should not contain IDs because these rules are too tightly coupled with the HTML.",
    "scss.lint.ieHack.desc": "IE hacks are only necessary when supporting IE7 and older.",
    "scss.lint.important.desc": "Avoid using `!important`. It is an indication that the specificity of the entire CSS has gotten out of control and needs to be refactored.",
    "scss.lint.importStatement.desc": "Import statements do not load in parallel.",
    "scss.lint.propertyIgnoredDueToDisplay.desc": "Property is ignored due to the display. E.g. with `display: inline`, the `width`, `height`, `margin-top`, `margin-bottom`, and `float` properties have no effect.",
    "scss.lint.universalSelector.desc": "The universal selector (`*`) is known to be slow.",
    "scss.lint.unknownAtRules.desc": "Unknown at-rule.",
    "scss.lint.unknownProperties.desc": "Unknown property.",
    "scss.lint.validProperties.desc": "A list of properties that are not validated against the `unknownProperties` rule.",
    "scss.lint.unknownVendorSpecificProperties.desc": "Unknown vendor specific property.",
    "scss.lint.vendorPrefix.desc": "When using a vendor-specific prefix, also include the standard property.",
    "scss.lint.zeroUnits.desc": "No unit for zero needed.",
    "scss.validate.title": "Controls SCSS validation and problem severities.",
    "scss.validate.desc": "Enables or disables all validations.",
    "css.colorDecorators.enable.deprecationMessage": "The setting `css.colorDecorators.enable` has been deprecated in favor of `editor.colorDecorators`.",
    "scss.colorDecorators.enable.deprecationMessage": "The setting `scss.colorDecorators.enable` has been deprecated in favor of `editor.colorDecorators`.",
    "less.colorDecorators.enable.deprecationMessage": "The setting `less.colorDecorators.enable` has been deprecated in favor of `editor.colorDecorators`."
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json",
    "server/dist/browser/cssServerMain.js",
    "README.md",
    "icons/css.png",
    "https://raw.githubusercontent.com/microsoft/vscode-css-languageservice/master/docs/customData.schema.json",
    "schemas/package.schema.json",
    "client/dist/browser/cssClientMain.js"
  ],
  "mode": "public"
}
