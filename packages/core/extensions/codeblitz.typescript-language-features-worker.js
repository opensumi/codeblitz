module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "typescript-language-features-worker",
    "version": "1.53.0-patch.3"
  },
  "packageJSON": {
    "name": "typescript-language-features-worker",
    "publisher": "alex",
    "version": "1.53.0-patch.3",
    "displayName": "%displayName%",
    "description": "%description%",
    "icon": "icon.png",
    "activationEvents": [
      "onLanguage:javascript",
      "onLanguage:javascriptreact",
      "onLanguage:typescript",
      "onLanguage:typescriptreact",
      "onLanguage:jsx-tags",
      "onCommand:typescript.reloadProjects",
      "onCommand:javascript.reloadProjects",
      "onCommand:typescript.selectTypeScriptVersion",
      "onCommand:javascript.goToProjectConfig",
      "onCommand:typescript.goToProjectConfig",
      "onCommand:typescript.openTsServerLog",
      "onCommand:workbench.action.tasks.runTask",
      "onCommand:_typescript.configurePlugin",
      "onCommand:_typescript.learnMoreAboutRefactorings",
      "onLanguage:jsonc"
    ],
    "contributes": {
      "jsonValidation": [
        {
          "fileMatch": "package.json",
          "url": "./schemas/package.schema.json"
        },
        {
          "fileMatch": "tsconfig.json",
          "url": "https://json.schemastore.org/tsconfig"
        },
        {
          "fileMatch": "tsconfig.json",
          "url": "./schemas/tsconfig.schema.json"
        },
        {
          "fileMatch": "tsconfig.*.json",
          "url": "https://json.schemastore.org/tsconfig"
        },
        {
          "fileMatch": "tsconfig-*.json",
          "url": "./schemas/tsconfig.schema.json"
        },
        {
          "fileMatch": "tsconfig-*.json",
          "url": "https://json.schemastore.org/tsconfig"
        },
        {
          "fileMatch": "tsconfig.*.json",
          "url": "./schemas/tsconfig.schema.json"
        },
        {
          "fileMatch": "typings.json",
          "url": "https://json.schemastore.org/typings"
        },
        {
          "fileMatch": ".bowerrc",
          "url": "https://json.schemastore.org/bowerrc"
        },
        {
          "fileMatch": ".babelrc",
          "url": "https://json.schemastore.org/babelrc"
        },
        {
          "fileMatch": ".babelrc.json",
          "url": "https://json.schemastore.org/babelrc"
        },
        {
          "fileMatch": "babel.config.json",
          "url": "https://json.schemastore.org/babelrc"
        },
        {
          "fileMatch": "jsconfig.json",
          "url": "https://json.schemastore.org/jsconfig"
        },
        {
          "fileMatch": "jsconfig.json",
          "url": "./schemas/jsconfig.schema.json"
        },
        {
          "fileMatch": "jsconfig.*.json",
          "url": "https://json.schemastore.org/jsconfig"
        },
        {
          "fileMatch": "jsconfig.*.json",
          "url": "./schemas/jsconfig.schema.json"
        }
      ],
      "configuration": {
        "type": "object",
        "title": "%configuration.typescript%",
        "order": 20,
        "properties": {
          "typescript.tsdk": {
            "type": [
              "string",
              "null"
            ],
            "default": null,
            "markdownDescription": "%typescript.tsdk.desc%",
            "scope": "window"
          },
          "typescript.disableAutomaticTypeAcquisition": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.disableAutomaticTypeAcquisition%",
            "scope": "window",
            "tags": [
              "usesOnlineServices"
            ]
          },
          "typescript.enablePromptUseWorkspaceTsdk": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.enablePromptUseWorkspaceTsdk%",
            "scope": "window"
          },
          "typescript.npm": {
            "type": [
              "string",
              "null"
            ],
            "default": null,
            "description": "%typescript.npm%",
            "scope": "machine"
          },
          "typescript.check.npmIsInstalled": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.check.npmIsInstalled%",
            "scope": "window"
          },
          "javascript.referencesCodeLens.enabled": {
            "type": "boolean",
            "default": false,
            "description": "%javascript.referencesCodeLens.enabled%",
            "scope": "window"
          },
          "javascript.referencesCodeLens.showOnAllFunctions": {
            "type": "boolean",
            "default": false,
            "description": "%javascript.referencesCodeLens.showOnAllFunctions%",
            "scope": "window"
          },
          "typescript.referencesCodeLens.enabled": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.referencesCodeLens.enabled%",
            "scope": "window"
          },
          "typescript.referencesCodeLens.showOnAllFunctions": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.referencesCodeLens.showOnAllFunctions%",
            "scope": "window"
          },
          "typescript.implementationsCodeLens.enabled": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.implementationsCodeLens.enabled%",
            "scope": "window"
          },
          "typescript.tsserver.enableTracing": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.tsserver.enableTracing%",
            "scope": "window"
          },
          "typescript.tsserver.log": {
            "type": "string",
            "enum": [
              "off",
              "terse",
              "normal",
              "verbose"
            ],
            "default": "off",
            "description": "%typescript.tsserver.log%",
            "scope": "window"
          },
          "typescript.tsserver.pluginPaths": {
            "type": "array",
            "items": {
              "type": "string",
              "description": "%typescript.tsserver.pluginPaths.item%"
            },
            "default": [],
            "description": "%typescript.tsserver.pluginPaths%",
            "scope": "machine"
          },
          "typescript.tsserver.trace": {
            "type": "string",
            "enum": [
              "off",
              "messages",
              "verbose"
            ],
            "default": "off",
            "description": "%typescript.tsserver.trace%",
            "scope": "window"
          },
          "javascript.suggest.completeFunctionCalls": {
            "type": "boolean",
            "default": false,
            "description": "%configuration.suggest.completeFunctionCalls%",
            "scope": "resource"
          },
          "typescript.suggest.completeFunctionCalls": {
            "type": "boolean",
            "default": false,
            "description": "%configuration.suggest.completeFunctionCalls%",
            "scope": "resource"
          },
          "javascript.suggest.includeAutomaticOptionalChainCompletions": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.includeAutomaticOptionalChainCompletions%",
            "scope": "resource"
          },
          "typescript.suggest.includeAutomaticOptionalChainCompletions": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.includeAutomaticOptionalChainCompletions%",
            "scope": "resource"
          },
          "typescript.reportStyleChecksAsWarnings": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.reportStyleChecksAsWarnings%",
            "scope": "window"
          },
          "typescript.validate.enable": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.validate.enable%",
            "scope": "window"
          },
          "typescript.format.enable": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.format.enable%",
            "scope": "window"
          },
          "typescript.format.insertSpaceAfterCommaDelimiter": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterCommaDelimiter%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterConstructor": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterConstructor%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterSemicolonInForStatements": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterSemicolonInForStatements%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceBeforeAndAfterBinaryOperators": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceBeforeAndAfterBinaryOperators%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterKeywordsInControlFlowStatements": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterKeywordsInControlFlowStatements%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterFunctionKeywordForAnonymousFunctions%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceBeforeFunctionParenthesis": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceBeforeFunctionParenthesis%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterTypeAssertion": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterTypeAssertion%",
            "scope": "resource"
          },
          "typescript.format.placeOpenBraceOnNewLineForFunctions": {
            "type": "boolean",
            "default": false,
            "description": "%format.placeOpenBraceOnNewLineForFunctions%",
            "scope": "resource"
          },
          "typescript.format.placeOpenBraceOnNewLineForControlBlocks": {
            "type": "boolean",
            "default": false,
            "description": "%format.placeOpenBraceOnNewLineForControlBlocks%",
            "scope": "resource"
          },
          "typescript.format.semicolons": {
            "type": "string",
            "default": "ignore",
            "description": "%format.semicolons%",
            "scope": "resource",
            "enum": [
              "ignore",
              "insert",
              "remove"
            ],
            "enumDescriptions": [
              "%format.semicolons.ignore%",
              "%format.semicolons.insert%",
              "%format.semicolons.remove%"
            ]
          },
          "javascript.validate.enable": {
            "type": "boolean",
            "default": true,
            "description": "%javascript.validate.enable%",
            "scope": "window"
          },
          "javascript.format.enable": {
            "type": "boolean",
            "default": true,
            "description": "%javascript.format.enable%",
            "scope": "window"
          },
          "javascript.format.insertSpaceAfterCommaDelimiter": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterCommaDelimiter%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterConstructor": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterConstructor%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterSemicolonInForStatements": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterSemicolonInForStatements%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceBeforeAndAfterBinaryOperators": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceBeforeAndAfterBinaryOperators%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterKeywordsInControlFlowStatements": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterKeywordsInControlFlowStatements%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterFunctionKeywordForAnonymousFunctions%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceBeforeFunctionParenthesis": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceBeforeFunctionParenthesis%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces%",
            "scope": "resource"
          },
          "javascript.format.placeOpenBraceOnNewLineForFunctions": {
            "type": "boolean",
            "default": false,
            "description": "%format.placeOpenBraceOnNewLineForFunctions%",
            "scope": "resource"
          },
          "javascript.format.placeOpenBraceOnNewLineForControlBlocks": {
            "type": "boolean",
            "default": false,
            "description": "%format.placeOpenBraceOnNewLineForControlBlocks%",
            "scope": "resource"
          },
          "javascript.format.semicolons": {
            "type": "string",
            "default": "ignore",
            "description": "%format.semicolons%",
            "scope": "resource",
            "enum": [
              "ignore",
              "insert",
              "remove"
            ],
            "enumDescriptions": [
              "%format.semicolons.ignore%",
              "%format.semicolons.insert%",
              "%format.semicolons.remove%"
            ]
          },
          "javascript.implicitProjectConfig.checkJs": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.implicitProjectConfig.checkJs%",
            "markdownDeprecationMessage": "%configuration.javascript.checkJs.checkJs.deprecation%",
            "scope": "window"
          },
          "js/ts.implicitProjectConfig.checkJs": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.implicitProjectConfig.checkJs%",
            "scope": "window"
          },
          "javascript.implicitProjectConfig.experimentalDecorators": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.implicitProjectConfig.experimentalDecorators%",
            "markdownDeprecationMessage": "%configuration.javascript.checkJs.experimentalDecorators.deprecation%",
            "scope": "window"
          },
          "js/ts.implicitProjectConfig.experimentalDecorators": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.implicitProjectConfig.experimentalDecorators%",
            "scope": "window"
          },
          "js/ts.implicitProjectConfig.strictNullChecks": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.implicitProjectConfig.strictNullChecks%",
            "scope": "window"
          },
          "js/ts.implicitProjectConfig.strictFunctionTypes": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.implicitProjectConfig.strictFunctionTypes%",
            "scope": "window"
          },
          "javascript.suggest.names": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.suggest.names%",
            "scope": "resource"
          },
          "typescript.tsc.autoDetect": {
            "type": "string",
            "default": "on",
            "enum": [
              "on",
              "off",
              "build",
              "watch"
            ],
            "markdownEnumDescriptions": [
              "%typescript.tsc.autoDetect.on%",
              "%typescript.tsc.autoDetect.off%",
              "%typescript.tsc.autoDetect.build%",
              "%typescript.tsc.autoDetect.watch%"
            ],
            "description": "%typescript.tsc.autoDetect%",
            "scope": "window"
          },
          "javascript.suggest.paths": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.paths%",
            "scope": "resource"
          },
          "typescript.suggest.paths": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.paths%",
            "scope": "resource"
          },
          "javascript.suggest.autoImports": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.autoImports%",
            "scope": "resource"
          },
          "typescript.suggest.autoImports": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.autoImports%",
            "scope": "resource"
          },
          "javascript.suggest.completeJSDocs": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.completeJSDocs%",
            "scope": "resource"
          },
          "typescript.suggest.completeJSDocs": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.completeJSDocs%",
            "scope": "resource"
          },
          "typescript.locale": {
            "type": [
              "string",
              "null"
            ],
            "enum": [
              "de",
              "es",
              "en",
              "fr",
              "it",
              "ja",
              "ko",
              "ru",
              "zh-CN",
              "zh-TW",
              null
            ],
            "default": null,
            "markdownDescription": "%typescript.locale%",
            "scope": "window"
          },
          "javascript.suggestionActions.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%javascript.suggestionActions.enabled%",
            "scope": "resource"
          },
          "typescript.suggestionActions.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.suggestionActions.enabled%",
            "scope": "resource"
          },
          "javascript.preferences.quoteStyle": {
            "type": "string",
            "enum": [
              "auto",
              "single",
              "double"
            ],
            "default": "auto",
            "markdownDescription": "%typescript.preferences.quoteStyle%",
            "scope": "resource"
          },
          "typescript.preferences.quoteStyle": {
            "type": "string",
            "enum": [
              "auto",
              "single",
              "double"
            ],
            "default": "auto",
            "markdownDescription": "%typescript.preferences.quoteStyle%",
            "scope": "resource"
          },
          "javascript.preferences.importModuleSpecifier": {
            "type": "string",
            "enum": [
              "shortest",
              "relative",
              "non-relative",
              "project-relative"
            ],
            "markdownEnumDescriptions": [
              "%typescript.preferences.importModuleSpecifier.shortest%",
              "%typescript.preferences.importModuleSpecifier.relative%",
              "%typescript.preferences.importModuleSpecifier.nonRelative%",
              "%typescript.preferences.importModuleSpecifier.projectRelative%"
            ],
            "default": "shortest",
            "description": "%typescript.preferences.importModuleSpecifier%",
            "scope": "resource"
          },
          "typescript.preferences.importModuleSpecifier": {
            "type": "string",
            "enum": [
              "shortest",
              "relative",
              "non-relative",
              "project-relative"
            ],
            "markdownEnumDescriptions": [
              "%typescript.preferences.importModuleSpecifier.shortest%",
              "%typescript.preferences.importModuleSpecifier.relative%",
              "%typescript.preferences.importModuleSpecifier.nonRelative%",
              "%typescript.preferences.importModuleSpecifier.projectRelative%"
            ],
            "default": "shortest",
            "description": "%typescript.preferences.importModuleSpecifier%",
            "scope": "resource"
          },
          "javascript.preferences.importModuleSpecifierEnding": {
            "type": "string",
            "enum": [
              "auto",
              "minimal",
              "index",
              "js"
            ],
            "markdownEnumDescriptions": [
              "%typescript.preferences.importModuleSpecifierEnding.auto%",
              "%typescript.preferences.importModuleSpecifierEnding.minimal%",
              "%typescript.preferences.importModuleSpecifierEnding.index%",
              "%typescript.preferences.importModuleSpecifierEnding.js%"
            ],
            "default": "auto",
            "description": "%typescript.preferences.importModuleSpecifierEnding%",
            "scope": "resource"
          },
          "typescript.preferences.importModuleSpecifierEnding": {
            "type": "string",
            "enum": [
              "auto",
              "minimal",
              "index",
              "js"
            ],
            "markdownEnumDescriptions": [
              "%typescript.preferences.importModuleSpecifierEnding.auto%",
              "%typescript.preferences.importModuleSpecifierEnding.minimal%",
              "%typescript.preferences.importModuleSpecifierEnding.index%",
              "%typescript.preferences.importModuleSpecifierEnding.js%"
            ],
            "default": "auto",
            "description": "%typescript.preferences.importModuleSpecifierEnding%",
            "scope": "resource"
          },
          "typescript.preferences.includePackageJsonAutoImports": {
            "type": "string",
            "enum": [
              "auto",
              "on",
              "off"
            ],
            "enumDescriptions": [
              "%typescript.preferences.includePackageJsonAutoImports.auto%",
              "%typescript.preferences.includePackageJsonAutoImports.on%",
              "%typescript.preferences.includePackageJsonAutoImports.off%"
            ],
            "default": "auto",
            "markdownDescription": "%typescript.preferences.includePackageJsonAutoImports%",
            "scope": "window"
          },
          "javascript.preferences.renameShorthandProperties": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.preferences.useAliasesForRenames%",
            "deprecationMessage": "%typescript.preferences.renameShorthandProperties.deprecationMessage%",
            "scope": "resource"
          },
          "typescript.preferences.renameShorthandProperties": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.preferences.useAliasesForRenames%",
            "deprecationMessage": "%typescript.preferences.renameShorthandProperties.deprecationMessage%",
            "scope": "resource"
          },
          "javascript.preferences.useAliasesForRenames": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.preferences.useAliasesForRenames%",
            "scope": "resource"
          },
          "typescript.preferences.useAliasesForRenames": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.preferences.useAliasesForRenames%",
            "scope": "resource"
          },
          "typescript.updateImportsOnFileMove.enabled": {
            "type": "string",
            "enum": [
              "prompt",
              "always",
              "never"
            ],
            "markdownEnumDescriptions": [
              "%typescript.updateImportsOnFileMove.enabled.prompt%",
              "%typescript.updateImportsOnFileMove.enabled.always%",
              "%typescript.updateImportsOnFileMove.enabled.never%"
            ],
            "default": "prompt",
            "description": "%typescript.updateImportsOnFileMove.enabled%",
            "scope": "resource"
          },
          "javascript.updateImportsOnFileMove.enabled": {
            "type": "string",
            "enum": [
              "prompt",
              "always",
              "never"
            ],
            "markdownEnumDescriptions": [
              "%typescript.updateImportsOnFileMove.enabled.prompt%",
              "%typescript.updateImportsOnFileMove.enabled.always%",
              "%typescript.updateImportsOnFileMove.enabled.never%"
            ],
            "default": "prompt",
            "description": "%typescript.updateImportsOnFileMove.enabled%",
            "scope": "resource"
          },
          "typescript.autoClosingTags": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.autoClosingTags%"
          },
          "javascript.autoClosingTags": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.autoClosingTags%"
          },
          "javascript.suggest.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.suggest.enabled%",
            "scope": "resource"
          },
          "typescript.suggest.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.suggest.enabled%",
            "scope": "resource"
          },
          "typescript.surveys.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.surveys.enabled%",
            "scope": "window"
          },
          "typescript.tsserver.useSeparateSyntaxServer": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.tsserver.useSeparateSyntaxServer%",
            "scope": "window"
          },
          "typescript.tsserver.maxTsServerMemory": {
            "type": "number",
            "default": 3072,
            "description": "%configuration.tsserver.maxTsServerMemory%",
            "scope": "window"
          },
          "typescript.tsserver.experimental.enableProjectDiagnostics": {
            "type": "boolean",
            "default": false,
            "description": "%configuration.tsserver.experimental.enableProjectDiagnostics%",
            "scope": "window"
          },
          "typescript.tsserver.watchOptions": {
            "type": "object",
            "description": "%configuration.tsserver.watchOptions%",
            "scope": "window",
            "properties": {
              "watchFile": {
                "type": "string",
                "description": "%configuration.tsserver.watchOptions.watchFile%",
                "enum": [
                  "fixedPollingInterval",
                  "priorityPollingInterval",
                  "dynamicPriorityPolling",
                  "useFsEvents",
                  "useFsEventsOnParentDirectory"
                ],
                "enumDescriptions": [
                  "%configuration.tsserver.watchOptions.watchFile.fixedPollingInterval%",
                  "%configuration.tsserver.watchOptions.watchFile.priorityPollingInterval%",
                  "%configuration.tsserver.watchOptions.watchFile.dynamicPriorityPolling%",
                  "%configuration.tsserver.watchOptions.watchFile.useFsEvents%",
                  "%configuration.tsserver.watchOptions.watchFile.useFsEventsOnParentDirectory%"
                ],
                "default": "useFsEvents"
              },
              "watchDirectory": {
                "type": "string",
                "description": "%configuration.tsserver.watchOptions.watchDirectory%",
                "enum": [
                  "fixedPollingInterval",
                  "dynamicPriorityPolling",
                  "useFsEvents"
                ],
                "enumDescriptions": [
                  "%configuration.tsserver.watchOptions.watchDirectory.fixedPollingInterval%",
                  "%configuration.tsserver.watchOptions.watchDirectory.dynamicPriorityPolling%",
                  "%configuration.tsserver.watchOptions.watchDirectory.useFsEvents%"
                ],
                "default": "useFsEvents"
              },
              "fallbackPolling": {
                "type": "string",
                "description": "%configuration.tsserver.watchOptions.fallbackPolling%",
                "enum": [
                  "fixedPollingInterval",
                  "priorityPollingInterval",
                  "dynamicPriorityPolling"
                ],
                "enumDescriptions": [
                  "configuration.tsserver.watchOptions.fallbackPolling.fixedPollingInterval",
                  "configuration.tsserver.watchOptions.fallbackPolling.priorityPollingInterval",
                  "configuration.tsserver.watchOptions.fallbackPolling.dynamicPriorityPolling"
                ]
              },
              "synchronousWatchDirectory": {
                "type": "boolean",
                "description": "%configuration.tsserver.watchOptions.synchronousWatchDirectory%"
              }
            }
          },
          "typescript.workspaceSymbols.scope": {
            "type": "string",
            "enum": [
              "allOpenProjects",
              "currentProject"
            ],
            "enumDescriptions": [
              "%typescript.workspaceSymbols.scope.allOpenProjects%",
              "%typescript.workspaceSymbols.scope.currentProject%"
            ],
            "default": "allOpenProjects",
            "markdownDescription": "%typescript.workspaceSymbols.scope%",
            "scope": "window"
          }
        }
      },
      "commands": [
        {
          "command": "typescript.reloadProjects",
          "title": "%reloadProjects.title%",
          "category": "TypeScript"
        },
        {
          "command": "javascript.reloadProjects",
          "title": "%reloadProjects.title%",
          "category": "JavaScript"
        },
        {
          "command": "typescript.selectTypeScriptVersion",
          "title": "%typescript.selectTypeScriptVersion.title%",
          "category": "TypeScript"
        },
        {
          "command": "typescript.goToProjectConfig",
          "title": "%goToProjectConfig.title%",
          "category": "TypeScript"
        },
        {
          "command": "javascript.goToProjectConfig",
          "title": "%goToProjectConfig.title%",
          "category": "JavaScript"
        },
        {
          "command": "typescript.openTsServerLog",
          "title": "%typescript.openTsServerLog.title%",
          "category": "TypeScript"
        },
        {
          "command": "typescript.restartTsServer",
          "title": "%typescript.restartTsServer%",
          "category": "TypeScript"
        }
      ],
      "menus": {
        "commandPalette": [
          {
            "command": "typescript.reloadProjects",
            "when": "editorLangId == typescript && typescript.isManagedFile"
          },
          {
            "command": "typescript.reloadProjects",
            "when": "editorLangId == typescriptreact && typescript.isManagedFile"
          },
          {
            "command": "javascript.reloadProjects",
            "when": "editorLangId == javascript && typescript.isManagedFile"
          },
          {
            "command": "javascript.reloadProjects",
            "when": "editorLangId == javascriptreact && typescript.isManagedFile"
          },
          {
            "command": "typescript.goToProjectConfig",
            "when": "editorLangId == typescript && typescript.isManagedFile"
          },
          {
            "command": "typescript.goToProjectConfig",
            "when": "editorLangId == typescriptreact"
          },
          {
            "command": "javascript.goToProjectConfig",
            "when": "editorLangId == javascript && typescript.isManagedFile"
          },
          {
            "command": "javascript.goToProjectConfig",
            "when": "editorLangId == javascriptreact && typescript.isManagedFile"
          },
          {
            "command": "typescript.selectTypeScriptVersion",
            "when": "typescript.isManagedFile"
          },
          {
            "command": "typescript.openTsServerLog",
            "when": "typescript.isManagedFile"
          },
          {
            "command": "typescript.restartTsServer",
            "when": "typescript.isManagedFile"
          }
        ]
      },
      "breakpoints": [
        {
          "language": "typescript"
        },
        {
          "language": "typescriptreact"
        }
      ],
      "taskDefinitions": [
        {
          "type": "typescript",
          "required": [
            "tsconfig"
          ],
          "properties": {
            "tsconfig": {
              "type": "string",
              "description": "%taskDefinition.tsconfig.description%"
            },
            "option": {
              "type": "string"
            }
          }
        }
      ],
      "problemPatterns": [
        {
          "name": "tsc",
          "regexp": "^([^\\s].*)[\\(:](\\d+)[,:](\\d+)(?:\\):\\s+|\\s+-\\s+)(error|warning|info)\\s+TS(\\d+)\\s*:\\s*(.*)$",
          "file": 1,
          "line": 2,
          "column": 3,
          "severity": 4,
          "code": 5,
          "message": 6
        }
      ],
      "problemMatchers": [
        {
          "name": "tsc",
          "label": "%typescript.problemMatchers.tsc.label%",
          "owner": "typescript",
          "source": "ts",
          "applyTo": "closedDocuments",
          "fileLocation": [
            "relative",
            "${cwd}"
          ],
          "pattern": "$tsc"
        },
        {
          "name": "tsc-watch",
          "label": "%typescript.problemMatchers.tscWatch.label%",
          "owner": "typescript",
          "source": "ts",
          "applyTo": "closedDocuments",
          "fileLocation": [
            "relative",
            "${cwd}"
          ],
          "pattern": "$tsc",
          "background": {
            "activeOnStart": true,
            "beginsPattern": {
              "regexp": "^\\s*(?:message TS6032:|\\[?\\D*\\d{1,2}[:.]\\d{1,2}[:.]\\d{1,2}\\D*(├\\D*\\d{1,2}\\D+┤)?(?:\\]| -)) File change detected\\. Starting incremental compilation\\.\\.\\."
            },
            "endsPattern": {
              "regexp": "^\\s*(?:message TS6042:|\\[?\\D*\\d{1,2}[:.]\\d{1,2}[:.]\\d{1,2}\\D*(├\\D*\\d{1,2}\\D+┤)?(?:\\]| -)) (?:Compilation complete\\.|Found \\d+ errors?\\.) Watching for file changes\\."
            }
          }
        }
      ],
      "codeActions": [
        {
          "languages": [
            "javascript",
            "javascriptreact",
            "typescript",
            "typescriptreact"
          ],
          "actions": [
            {
              "kind": "refactor.extract.constant",
              "title": "%codeActions.refactor.extract.constant.title%",
              "description": "%codeActions.refactor.extract.constant.description%"
            },
            {
              "kind": "refactor.extract.function",
              "title": "%codeActions.refactor.extract.function.title%",
              "description": "%codeActions.refactor.extract.function.description%"
            },
            {
              "kind": "refactor.extract.interface",
              "title": "%codeActions.refactor.extract.interface.title%",
              "description": "%codeActions.refactor.extract.interface.description%"
            },
            {
              "kind": "refactor.extract.type",
              "title": "%codeActions.refactor.extract.type.title%",
              "description": "%codeActions.refactor.extract.type.description%"
            },
            {
              "kind": "refactor.rewrite.import",
              "title": "%codeActions.refactor.rewrite.import.title%",
              "description": "%codeActions.refactor.rewrite.import.description%"
            },
            {
              "kind": "refactor.rewrite.export",
              "title": "%codeActions.refactor.rewrite.export.title%",
              "description": "%codeActions.refactor.rewrite.export.description%"
            },
            {
              "kind": "refactor.rewrite.arrow.braces",
              "title": "%codeActions.refactor.rewrite.arrow.braces.title%",
              "description": "%codeActions.refactor.rewrite.arrow.braces.description%"
            },
            {
              "kind": "refactor.rewrite.parameters.toDestructured",
              "title": "%codeActions.refactor.rewrite.parameters.toDestructured.title%"
            },
            {
              "kind": "refactor.rewrite.property.generateAccessors",
              "title": "%codeActions.refactor.rewrite.property.generateAccessors.title%",
              "description": "%codeActions.refactor.rewrite.property.generateAccessors.description%"
            },
            {
              "kind": "refactor.move.newFile",
              "title": "%codeActions.refactor.move.newFile.title%",
              "description": "%codeActions.refactor.move.newFile.description%"
            },
            {
              "kind": "source.organizeImports",
              "title": "%codeActions.source.organizeImports.title%"
            }
          ]
        }
      ],
      "typescriptServerPlugins": [
        {
          "name": "typescript-vscode-sh-plugin",
          "enableForWorkspaceTypeScriptVersions": true
        }
      ]
    },
    "browser": "./dist/browser/extension"
  },
  "defaultPkgNlsJSON": {
    "displayName": "TypeScript and JavaScript Language Features",
    "description": "Provides rich language support for JavaScript and TypeScript.",
    "reloadProjects.title": "Reload Project",
    "configuration.typescript": "TypeScript",
    "configuration.suggest.completeFunctionCalls": "Complete functions with their parameter signature.",
    "configuration.suggest.includeAutomaticOptionalChainCompletions": "Enable/disable showing completions on potentially undefined values that insert an optional chain call. Requires TS 3.7+ and strict null checks to be enabled.",
    "typescript.tsdk.desc": "Specifies the folder path to the tsserver and lib*.d.ts files under a TypeScript install to use for IntelliSense, for example: `./node_modules/typescript/lib`.\n\n- When specified as a user setting, the TypeScript version from `typescript.tsdk` automatically replaces the built-in TypeScript version.\n- When specified as a workspace setting, `typescript.tsdk` allows you to switch to use that workspace version of TypeScript for IntelliSense with the `TypeScript: Select TypeScript version` command.\n\nSee the [TypeScript documentation](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-newer-typescript-versions) for more detail about managing TypeScript versions.",
    "typescript.disableAutomaticTypeAcquisition": "Disables automatic type acquisition. Automatic type acquisition fetches `@types` packages from npm to improve IntelliSense for external libraries.",
    "typescript.enablePromptUseWorkspaceTsdk": "Enables prompting of users to use the TypeScript version configured in the workspace for Intellisense.",
    "typescript.tsserver.enableTracing": "Enables tracing TS server performance to a directory. These trace files can be used to diagnose TS Server performance issues. The log may contain file paths, source code, and other potentially sensitive information from your project.",
    "typescript.tsserver.log": "Enables logging of the TS server to a file. This log can be used to diagnose TS Server issues. The log may contain file paths, source code, and other potentially sensitive information from your project.",
    "typescript.tsserver.pluginPaths": "Additional paths to discover TypeScript Language Service plugins.",
    "typescript.tsserver.pluginPaths.item": "Either an absolute or relative path. Relative path will be resolved against workspace folder(s).",
    "typescript.tsserver.trace": "Enables tracing of messages sent to the TS server. This trace can be used to diagnose TS Server issues. The trace may contain file paths, source code, and other potentially sensitive information from your project.",
    "typescript.validate.enable": "Enable/disable TypeScript validation.",
    "typescript.format.enable": "Enable/disable default TypeScript formatter.",
    "javascript.format.enable": "Enable/disable default JavaScript formatter.",
    "format.insertSpaceAfterCommaDelimiter": "Defines space handling after a comma delimiter.",
    "format.insertSpaceAfterConstructor": "Defines space handling after the constructor keyword.",
    "format.insertSpaceAfterSemicolonInForStatements": "Defines space handling after a semicolon in a for statement.",
    "format.insertSpaceBeforeAndAfterBinaryOperators": "Defines space handling after a binary operator.",
    "format.insertSpaceAfterKeywordsInControlFlowStatements": "Defines space handling after keywords in a control flow statement.",
    "format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": "Defines space handling after function keyword for anonymous functions.",
    "format.insertSpaceBeforeFunctionParenthesis": "Defines space handling before function argument parentheses.",
    "format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": "Defines space handling after opening and before closing non-empty parenthesis.",
    "format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": "Defines space handling after opening and before closing non-empty brackets.",
    "format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": "Defines space handling after opening and before closing non-empty braces.",
    "format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces": "Defines space handling after opening and before closing empty braces.",
    "format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": "Defines space handling after opening and before closing template string braces.",
    "format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces": "Defines space handling after opening and before closing JSX expression braces.",
    "format.insertSpaceAfterTypeAssertion": "Defines space handling after type assertions in TypeScript.",
    "format.placeOpenBraceOnNewLineForFunctions": "Defines whether an open brace is put onto a new line for functions or not.",
    "format.placeOpenBraceOnNewLineForControlBlocks": "Defines whether an open brace is put onto a new line for control blocks or not.",
    "format.semicolons": "Defines handling of optional semicolons. Requires using TypeScript 3.7 or newer in the workspace.",
    "format.semicolons.ignore": "Don't insert or remove any semicolons.",
    "format.semicolons.insert": "Insert semicolons at statement ends.",
    "format.semicolons.remove": "Remove unnecessary semicolons.",
    "javascript.validate.enable": "Enable/disable JavaScript validation.",
    "goToProjectConfig.title": "Go to Project Configuration",
    "javascript.referencesCodeLens.enabled": "Enable/disable references CodeLens in JavaScript files.",
    "javascript.referencesCodeLens.showOnAllFunctions": "Enable/disable references CodeLens on all functions in JavaScript files.",
    "typescript.referencesCodeLens.enabled": "Enable/disable references CodeLens in TypeScript files.",
    "typescript.referencesCodeLens.showOnAllFunctions": "Enable/disable references CodeLens on all functions in TypeScript files.",
    "typescript.implementationsCodeLens.enabled": "Enable/disable implementations CodeLens. This CodeLens shows the implementers of an interface.",
    "typescript.openTsServerLog.title": "Open TS Server log",
    "typescript.restartTsServer": "Restart TS server",
    "typescript.selectTypeScriptVersion.title": "Select TypeScript Version...",
    "typescript.reportStyleChecksAsWarnings": "Report style checks as warnings.",
    "typescript.npm": "Specifies the path to the npm executable used for Automatic Type Acquisition.",
    "typescript.check.npmIsInstalled": "Check if npm is installed for Automatic Type Acquisition.",
    "configuration.suggest.names": "Enable/disable including unique names from the file in JavaScript suggestions. Note that name suggestions are always disabled in JavaScript code that is semantically checked using `@ts-check` or `checkJs`.",
    "typescript.tsc.autoDetect": "Controls auto detection of tsc tasks.",
    "typescript.tsc.autoDetect.off": "Disable this feature.",
    "typescript.tsc.autoDetect.on": "Create both build and watch tasks.",
    "typescript.tsc.autoDetect.build": "Only create single run compile tasks.",
    "typescript.tsc.autoDetect.watch": "Only create compile and watch tasks.",
    "typescript.problemMatchers.tsc.label": "TypeScript problems",
    "typescript.problemMatchers.tscWatch.label": "TypeScript problems (watch mode)",
    "configuration.suggest.paths": "Enable/disable suggestions for paths in import statements and require calls.",
    "configuration.tsserver.useSeparateSyntaxServer": "Enable/disable spawning a separate TypeScript server that can more quickly respond to syntax related operations, such as calculating folding or computing document symbols. Requires using TypeScript 3.4.0 or newer in the workspace.",
    "configuration.tsserver.maxTsServerMemory": "Set the maximum amount of memory (in MB) to allocate to the TypeScript server process",
    "configuration.tsserver.experimental.enableProjectDiagnostics": "(Experimental) Enables project wide error reporting.",
    "typescript.locale": "Sets the locale used to report JavaScript and TypeScript errors. Default of `null` uses VS Code's locale.",
    "configuration.implicitProjectConfig.checkJs": "Enable/disable semantic checking of JavaScript files. Existing `jsconfig.json` or `tsconfig.json` files override this setting.",
    "configuration.javascript.checkJs.checkJs.deprecation": "This setting has been deprecated in favor of `#js/ts.implicitProjectConfig.checkJs#`.",
    "configuration.implicitProjectConfig.experimentalDecorators": "Enable/disable `experimentalDecorators` in JavaScript files that are not part of a project. Existing `jsconfig.json` or `tsconfig.json` files override this setting.",
    "configuration.javascript.checkJs.experimentalDecorators.deprecation": "This setting has been deprecated in favor of `#js/ts.implicitProjectConfig.experimentalDecorators#`.",
    "configuration.implicitProjectConfig.strictNullChecks": "Enable/disable [strict null checks](https://www.typescriptlang.org/tsconfig#strictNullChecks) in JavaScript and TypeScript files that are not part of a project. Existing `jsconfig.json` or `tsconfig.json` files override this setting.",
    "configuration.implicitProjectConfig.strictFunctionTypes": "Enable/disable [strict function types](https://www.typescriptlang.org/tsconfig#strictFunctionTypes) in JavaScript and TypeScript files that are not part of a project. Existing `jsconfig.json` or `tsconfig.json` files override this setting.",
    "configuration.suggest.autoImports": "Enable/disable auto import suggestions.",
    "taskDefinition.tsconfig.description": "The tsconfig file that defines the TS build.",
    "javascript.suggestionActions.enabled": "Enable/disable suggestion diagnostics for JavaScript files in the editor.",
    "typescript.suggestionActions.enabled": "Enable/disable suggestion diagnostics for TypeScript files in the editor.",
    "typescript.preferences.quoteStyle": "Preferred quote style to use for quick fixes: `single` quotes, `double` quotes, or `auto` infer quote type from existing imports.",
    "typescript.preferences.importModuleSpecifier": "Preferred path style for auto imports.",
    "typescript.preferences.importModuleSpecifier.shortest": "Prefers a non-relative import only if one is available that has fewer path segments than a relative import.",
    "typescript.preferences.importModuleSpecifier.relative": "Prefers a relative path to the imported file location.",
    "typescript.preferences.importModuleSpecifier.nonRelative": "Prefers a non-relative import based on the `baseUrl` or `paths` configured in your `jsconfig.json` / `tsconfig.json`.",
    "typescript.preferences.importModuleSpecifier.projectRelative": "Prefers a non-relative import only if the relative import path would leave the package or project directory. Requires using TypeScript 4.2+ in the workspace.",
    "typescript.preferences.importModuleSpecifierEnding": "Preferred path ending for auto imports.",
    "typescript.preferences.importModuleSpecifierEnding.auto": "Use project settings to select a default.",
    "typescript.preferences.importModuleSpecifierEnding.minimal": "Shorten `./component/index.js` to `./component`.",
    "typescript.preferences.importModuleSpecifierEnding.index": "Shorten `./component/index.js` to `./component/index`.",
    "typescript.preferences.importModuleSpecifierEnding.js": "Do not shorten path endings; include the `.js` extension.",
    "typescript.preferences.includePackageJsonAutoImports": "Enable/disable searching `package.json` dependencies for available auto imports.",
    "typescript.preferences.includePackageJsonAutoImports.auto": "Search dependencies based on estimated performance impact.",
    "typescript.preferences.includePackageJsonAutoImports.on": "Always search dependencies.",
    "typescript.preferences.includePackageJsonAutoImports.off": "Never search dependencies.",
    "typescript.updateImportsOnFileMove.enabled": "Enable/disable automatic updating of import paths when you rename or move a file in VS Code.",
    "typescript.updateImportsOnFileMove.enabled.prompt": "Prompt on each rename.",
    "typescript.updateImportsOnFileMove.enabled.always": "Always update paths automatically.",
    "typescript.updateImportsOnFileMove.enabled.never": "Never rename paths and don't prompt.",
    "typescript.autoClosingTags": "Enable/disable automatic closing of JSX tags.",
    "typescript.suggest.enabled": "Enabled/disable autocomplete suggestions.",
    "configuration.surveys.enabled": "Enabled/disable occasional surveys that help us improve VS Code's JavaScript and TypeScript support.",
    "configuration.suggest.completeJSDocs": "Enable/disable suggestion to complete JSDoc comments.",
    "configuration.tsserver.watchOptions": "Configure which watching strategies should be used to keep track of files and directories. Requires using TypeScript 3.8+ in the workspace.",
    "configuration.tsserver.watchOptions.watchFile": "Strategy for how individual files are watched.",
    "configuration.tsserver.watchOptions.watchFile.fixedPollingInterval": "Check every file for changes several times a second at a fixed interval.",
    "configuration.tsserver.watchOptions.watchFile.priorityPollingInterval": "Check every file for changes several times a second, but use heuristics to check certain types of files less frequently than others.",
    "configuration.tsserver.watchOptions.watchFile.dynamicPriorityPolling": "Use a dynamic queue where less-frequently modified files will be checked less often.",
    "configuration.tsserver.watchOptions.watchFile.useFsEvents": "Attempt to use the operating system/file system’s native events for file changes.",
    "configuration.tsserver.watchOptions.watchFile.useFsEventsOnParentDirectory": "Attempt to use the operating system/file system’s native events to listen for changes on a file’s containing directories. This can use fewer file watchers, but might be less accurate.",
    "configuration.tsserver.watchOptions.watchDirectory": "Strategy for how entire directory trees are watched under systems that lack recursive file-watching functionality.",
    "configuration.tsserver.watchOptions.watchDirectory.fixedPollingInterval": "Check every directory for changes several times a second at a fixed interval.",
    "configuration.tsserver.watchOptions.watchDirectory.dynamicPriorityPolling": "Use a dynamic queue where less-frequently modified directories will be checked less often.",
    "configuration.tsserver.watchOptions.watchDirectory.useFsEvents": "Attempt to use the operating system/file system’s native events for directory changes.",
    "configuration.tsserver.watchOptions.fallbackPolling": "When using file system events, this option specifies the polling strategy that gets used when the system runs out of native file watchers and/or doesn’t support native file watchers.",
    "configuration.tsserver.watchOptions.fallbackPolling.fixedPollingInterval": "Check every file for changes several times a second at a fixed interval.",
    "configuration.tsserver.watchOptions.fallbackPolling.priorityPollingInterval": "Check every file for changes several times a second, but use heuristics to check certain types of files less frequently than others.",
    "configuration.tsserver.watchOptions.fallbackPolling.dynamicPriorityPolling ": "Use a dynamic queue where less-frequently modified files will be checked less often.",
    "configuration.tsserver.watchOptions.synchronousWatchDirectory": "Disable deferred watching on directories. Deferred watching is useful when lots of file changes might occur at once (e.g. a change in node_modules from running npm install), but you might want to disable it with this flag for some less-common setups.",
    "typescript.preferences.renameShorthandProperties.deprecationMessage": "The setting 'typescript.preferences.renameShorthandProperties' has been deprecated in favor of 'typescript.preferences.useAliasesForRenames'",
    "typescript.preferences.useAliasesForRenames": "Enable/disable introducing aliases for object shorthand properties during renames. Requires using TypeScript 3.4 or newer in the workspace.",
    "typescript.workspaceSymbols.scope": "Controls which files are searched by [go to symbol in workspace](https://code.visualstudio.com/docs/editor/editingevolved#_open-symbol-by-name).",
    "typescript.workspaceSymbols.scope.allOpenProjects": "Search all open JavaScript or TypeScript projects for symbols. Requires using TypeScript 3.9 or newer in the workspace.",
    "typescript.workspaceSymbols.scope.currentProject": "Only search for symbols in the current JavaScript or TypeScript project.",
    "codeActions.refactor.extract.constant.title": "Extract constant",
    "codeActions.refactor.extract.constant.description": "Extract expression to constant.",
    "codeActions.refactor.extract.function.title": "Extract function",
    "codeActions.refactor.extract.function.description": "Extract expression to method or function.",
    "codeActions.refactor.extract.type.title": "Extract type",
    "codeActions.refactor.extract.type.description": "Extract type to a type alias.",
    "codeActions.refactor.extract.interface.title": "Extract interface",
    "codeActions.refactor.extract.interface.description": "Extract type to an interface.",
    "codeActions.refactor.rewrite.import.title": "Convert import",
    "codeActions.refactor.rewrite.import.description": "Convert between named imports and namespace imports.",
    "codeActions.refactor.rewrite.export.title": "Convert export",
    "codeActions.refactor.rewrite.export.description": "Convert between default export and named export.",
    "codeActions.refactor.move.newFile.title": "Move to a new file",
    "codeActions.refactor.move.newFile.description": "Move the expression to a new file.",
    "codeActions.refactor.rewrite.arrow.braces.title": "Rewrite arrow braces",
    "codeActions.refactor.rewrite.arrow.braces.description": "Add or remove braces in an arrow function.",
    "codeActions.refactor.rewrite.parameters.toDestructured.title": "Convert parameters to destructured object",
    "codeActions.refactor.rewrite.property.generateAccessors.title": "Generate accessors",
    "codeActions.refactor.rewrite.property.generateAccessors.description": "Generate 'get' and 'set' accessors",
    "codeActions.source.organizeImports.title": "Organize imports"
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json",
    "dist/browser/typescript-web/cancellationToken.js",
    "dist/browser/typescript-web/lib.d.ts",
    "dist/browser/typescript-web/lib.dom.d.ts",
    "dist/browser/typescript-web/lib.dom.iterable.d.ts",
    "dist/browser/typescript-web/lib.es2015.collection.d.ts",
    "dist/browser/typescript-web/lib.es2015.core.d.ts",
    "dist/browser/typescript-web/lib.es2015.d.ts",
    "dist/browser/typescript-web/lib.es2015.generator.d.ts",
    "dist/browser/typescript-web/lib.es2015.iterable.d.ts",
    "dist/browser/typescript-web/lib.es2015.promise.d.ts",
    "dist/browser/typescript-web/lib.es2015.proxy.d.ts",
    "dist/browser/typescript-web/lib.es2015.reflect.d.ts",
    "dist/browser/typescript-web/lib.es2015.symbol.d.ts",
    "dist/browser/typescript-web/lib.es2015.symbol.wellknown.d.ts",
    "dist/browser/typescript-web/lib.es2016.array.include.d.ts",
    "dist/browser/typescript-web/lib.es2016.d.ts",
    "dist/browser/typescript-web/lib.es2016.full.d.ts",
    "dist/browser/typescript-web/lib.es2017.d.ts",
    "dist/browser/typescript-web/lib.es2017.full.d.ts",
    "dist/browser/typescript-web/lib.es2017.intl.d.ts",
    "dist/browser/typescript-web/lib.es2017.object.d.ts",
    "dist/browser/typescript-web/lib.es2017.sharedmemory.d.ts",
    "dist/browser/typescript-web/lib.es2017.string.d.ts",
    "dist/browser/typescript-web/lib.es2017.typedarrays.d.ts",
    "dist/browser/typescript-web/lib.es2018.asyncgenerator.d.ts",
    "dist/browser/typescript-web/lib.es2018.asynciterable.d.ts",
    "dist/browser/typescript-web/lib.es2018.d.ts",
    "dist/browser/typescript-web/lib.es2018.full.d.ts",
    "dist/browser/typescript-web/lib.es2018.intl.d.ts",
    "dist/browser/typescript-web/lib.es2018.promise.d.ts",
    "dist/browser/typescript-web/lib.es2018.regexp.d.ts",
    "dist/browser/typescript-web/lib.es2019.array.d.ts",
    "dist/browser/typescript-web/lib.es2019.d.ts",
    "dist/browser/typescript-web/lib.es2019.full.d.ts",
    "dist/browser/typescript-web/lib.es2019.object.d.ts",
    "dist/browser/typescript-web/lib.es2019.string.d.ts",
    "dist/browser/typescript-web/lib.es2019.symbol.d.ts",
    "dist/browser/typescript-web/lib.es2020.bigint.d.ts",
    "dist/browser/typescript-web/lib.es2020.d.ts",
    "dist/browser/typescript-web/lib.es2020.full.d.ts",
    "dist/browser/typescript-web/lib.es2020.intl.d.ts",
    "dist/browser/typescript-web/lib.es2020.promise.d.ts",
    "dist/browser/typescript-web/lib.es2020.sharedmemory.d.ts",
    "dist/browser/typescript-web/lib.es2020.string.d.ts",
    "dist/browser/typescript-web/lib.es2020.symbol.wellknown.d.ts",
    "dist/browser/typescript-web/lib.es5.d.ts",
    "dist/browser/typescript-web/lib.es6.d.ts",
    "dist/browser/typescript-web/lib.esnext.d.ts",
    "dist/browser/typescript-web/lib.esnext.full.d.ts",
    "dist/browser/typescript-web/lib.esnext.intl.d.ts",
    "dist/browser/typescript-web/lib.esnext.promise.d.ts",
    "dist/browser/typescript-web/lib.esnext.string.d.ts",
    "dist/browser/typescript-web/lib.esnext.weakref.d.ts",
    "dist/browser/typescript-web/lib.scripthost.d.ts",
    "dist/browser/typescript-web/lib.webworker.d.ts",
    "dist/browser/typescript-web/lib.webworker.importscripts.d.ts",
    "dist/browser/typescript-web/lib.webworker.iterable.d.ts",
    "dist/browser/typescript-web/protocol.d.ts",
    "dist/browser/typescript-web/tsc.js",
    "dist/browser/typescript-web/tsserver.js",
    "dist/browser/typescript-web/tsserver.web.js",
    "dist/browser/typescript-web/tsserverlibrary.d.ts",
    "dist/browser/typescript-web/tsserverlibrary.js",
    "dist/browser/typescript-web/typesMap.json",
    "dist/browser/typescript-web/typescript.d.ts",
    "dist/browser/typescript-web/typescript.js",
    "dist/browser/typescript-web/typescriptServices.d.ts",
    "dist/browser/typescript-web/typescriptServices.js",
    "dist/browser/typescript-web/typingsInstaller.js",
    "dist/browser/typescript-web/watchGuard.js",
    "README.md",
    "icon.png",
    "schemas/package.schema.json",
    "https://json.schemastore.org/tsconfig",
    "schemas/tsconfig.schema.json",
    "https://json.schemastore.org/typings",
    "https://json.schemastore.org/bowerrc",
    "https://json.schemastore.org/babelrc",
    "https://json.schemastore.org/jsconfig",
    "schemas/jsconfig.schema.json",
    "dist/browser/extension.js"
  ],
  "mode": "public"
}
