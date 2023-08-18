module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "emmet",
    "version": "1.0.0"
  },
  "packageJSON": {
    "name": "emmet",
    "publisher": "vscode",
    "version": "1.0.0",
    "repository": {
      "type": "git",
      "url": "https://github.com/microsoft/vscode.git"
    },
    "displayName": "Emmet",
    "description": "%description%",
    "icon": "images/icon.png",
    "activationEvents": [
      "onCommand:emmet.expandAbbreviation",
      "onCommand:editor.emmet.action.wrapWithAbbreviation",
      "onCommand:editor.emmet.action.removeTag",
      "onCommand:editor.emmet.action.updateTag",
      "onCommand:editor.emmet.action.matchTag",
      "onCommand:editor.emmet.action.balanceIn",
      "onCommand:editor.emmet.action.balanceOut",
      "onCommand:editor.emmet.action.prevEditPoint",
      "onCommand:editor.emmet.action.nextEditPoint",
      "onCommand:editor.emmet.action.mergeLines",
      "onCommand:editor.emmet.action.selectPrevItem",
      "onCommand:editor.emmet.action.selectNextItem",
      "onCommand:editor.emmet.action.splitJoinTag",
      "onCommand:editor.emmet.action.toggleComment",
      "onCommand:editor.emmet.action.evaluateMathExpression",
      "onCommand:editor.emmet.action.updateImageSize",
      "onCommand:editor.emmet.action.incrementNumberByOneTenth",
      "onCommand:editor.emmet.action.incrementNumberByOne",
      "onCommand:editor.emmet.action.incrementNumberByTen",
      "onCommand:editor.emmet.action.decrementNumberByOneTenth",
      "onCommand:editor.emmet.action.decrementNumberByOne",
      "onCommand:editor.emmet.action.decrementNumberByTen",
      "onCommand:editor.emmet.action.reflectCSSValue",
      "onCommand:workbench.action.showEmmetCommands",
      "onStartupFinished"
    ],
    "contributes": {
      "configuration": {
        "type": "object",
        "title": "Emmet",
        "properties": {
          "emmet.showExpandedAbbreviation": {
            "type": [
              "string"
            ],
            "enum": [
              "never",
              "always",
              "inMarkupAndStylesheetFilesOnly"
            ],
            "default": "always",
            "markdownDescription": "%emmetShowExpandedAbbreviation%"
          },
          "emmet.showAbbreviationSuggestions": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%emmetShowAbbreviationSuggestions%"
          },
          "emmet.includeLanguages": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            },
            "default": {},
            "scope": "resource",
            "markdownDescription": "%emmetIncludeLanguages%"
          },
          "emmet.variables": {
            "type": "object",
            "properties": {
              "lang": {
                "type": "string",
                "default": "en"
              },
              "charset": {
                "type": "string",
                "default": "UTF-8"
              }
            },
            "additionalProperties": {
              "type": "string"
            },
            "default": {},
            "scope": "resource",
            "markdownDescription": "%emmetVariables%"
          },
          "emmet.syntaxProfiles": {
            "type": "object",
            "default": {},
            "scope": "resource",
            "markdownDescription": "%emmetSyntaxProfiles%"
          },
          "emmet.excludeLanguages": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "default": [
              "markdown"
            ],
            "scope": "resource",
            "markdownDescription": "%emmetExclude%"
          },
          "emmet.extensionsPath": {
            "type": "array",
            "items": {
              "type": "string",
              "markdownDescription": "%emmetExtensionsPathItem%"
            },
            "default": [],
            "scope": "machine-overridable",
            "markdownDescription": "%emmetExtensionsPath%"
          },
          "emmet.triggerExpansionOnTab": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%emmetTriggerExpansionOnTab%"
          },
          "emmet.preferences": {
            "type": "object",
            "default": {},
            "scope": "resource",
            "markdownDescription": "%emmetPreferences%",
            "properties": {
              "css.intUnit": {
                "type": "string",
                "default": "px",
                "markdownDescription": "%emmetPreferencesIntUnit%"
              },
              "css.floatUnit": {
                "type": "string",
                "default": "em",
                "markdownDescription": "%emmetPreferencesFloatUnit%"
              },
              "css.propertyEnd": {
                "type": "string",
                "default": ";",
                "markdownDescription": "%emmetPreferencesCssAfter%"
              },
              "sass.propertyEnd": {
                "type": "string",
                "default": "",
                "markdownDescription": "%emmetPreferencesSassAfter%"
              },
              "stylus.propertyEnd": {
                "type": "string",
                "default": "",
                "markdownDescription": "%emmetPreferencesStylusAfter%"
              },
              "css.valueSeparator": {
                "type": "string",
                "default": ": ",
                "markdownDescription": "%emmetPreferencesCssBetween%"
              },
              "sass.valueSeparator": {
                "type": "string",
                "default": ": ",
                "markdownDescription": "%emmetPreferencesSassBetween%"
              },
              "stylus.valueSeparator": {
                "type": "string",
                "default": " ",
                "markdownDescription": "%emmetPreferencesStylusBetween%"
              },
              "bem.elementSeparator": {
                "type": "string",
                "default": "__",
                "markdownDescription": "%emmetPreferencesBemElementSeparator%"
              },
              "bem.modifierSeparator": {
                "type": "string",
                "default": "_",
                "markdownDescription": "%emmetPreferencesBemModifierSeparator%"
              },
              "filter.commentBefore": {
                "type": "string",
                "default": "",
                "markdownDescription": "%emmetPreferencesFilterCommentBefore%"
              },
              "filter.commentAfter": {
                "type": "string",
                "default": "\n<!-- /[#ID][.CLASS] -->",
                "markdownDescription": "%emmetPreferencesFilterCommentAfter%"
              },
              "filter.commentTrigger": {
                "type": "array",
                "default": [
                  "id",
                  "class"
                ],
                "markdownDescription": "%emmetPreferencesFilterCommentTrigger%"
              },
              "format.noIndentTags": {
                "type": "array",
                "default": [
                  "html"
                ],
                "markdownDescription": "%emmetPreferencesFormatNoIndentTags%"
              },
              "format.forceIndentationForTags": {
                "type": "array",
                "default": [
                  "body"
                ],
                "markdownDescription": "%emmetPreferencesFormatForceIndentTags%"
              },
              "profile.allowCompactBoolean": {
                "type": "boolean",
                "default": false,
                "markdownDescription": "%emmetPreferencesAllowCompactBoolean%"
              },
              "css.webkitProperties": {
                "type": "string",
                "default": null,
                "markdownDescription": "%emmetPreferencesCssWebkitProperties%"
              },
              "css.mozProperties": {
                "type": "string",
                "default": null,
                "markdownDescription": "%emmetPreferencesCssMozProperties%"
              },
              "css.oProperties": {
                "type": "string",
                "default": null,
                "markdownDescription": "%emmetPreferencesCssOProperties%"
              },
              "css.msProperties": {
                "type": "string",
                "default": null,
                "markdownDescription": "%emmetPreferencesCssMsProperties%"
              },
              "css.fuzzySearchMinScore": {
                "type": "number",
                "default": 0.3,
                "markdownDescription": "%emmetPreferencesCssFuzzySearchMinScore%"
              },
              "output.inlineBreak": {
                "type": "number",
                "default": 0,
                "markdownDescription": "%emmetPreferencesOutputInlineBreak%"
              },
              "output.reverseAttributes": {
                "type": "boolean",
                "default": false,
                "markdownDescription": "%emmetPreferencesOutputReverseAttributes%"
              },
              "output.selfClosingStyle": {
                "type": "string",
                "enum": [
                  "html",
                  "xhtml",
                  "xml"
                ],
                "default": "html",
                "markdownDescription": "%emmetPreferencesOutputSelfClosingStyle%"
              },
              "css.color.short": {
                "type": "boolean",
                "default": true,
                "markdownDescription": "%emmetPreferencesCssColorShort%"
              }
            }
          },
          "emmet.showSuggestionsAsSnippets": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%emmetShowSuggestionsAsSnippets%"
          },
          "emmet.optimizeStylesheetParsing": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%emmetOptimizeStylesheetParsing%"
          }
        }
      },
      "commands": [
        {
          "command": "editor.emmet.action.wrapWithAbbreviation",
          "title": "%command.wrapWithAbbreviation%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.removeTag",
          "title": "%command.removeTag%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.updateTag",
          "title": "%command.updateTag%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.matchTag",
          "title": "%command.matchTag%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.balanceIn",
          "title": "%command.balanceIn%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.balanceOut",
          "title": "%command.balanceOut%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.prevEditPoint",
          "title": "%command.prevEditPoint%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.nextEditPoint",
          "title": "%command.nextEditPoint%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.mergeLines",
          "title": "%command.mergeLines%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.selectPrevItem",
          "title": "%command.selectPrevItem%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.selectNextItem",
          "title": "%command.selectNextItem%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.splitJoinTag",
          "title": "%command.splitJoinTag%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.toggleComment",
          "title": "%command.toggleComment%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.evaluateMathExpression",
          "title": "%command.evaluateMathExpression%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.updateImageSize",
          "title": "%command.updateImageSize%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.incrementNumberByOneTenth",
          "title": "%command.incrementNumberByOneTenth%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.incrementNumberByOne",
          "title": "%command.incrementNumberByOne%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.incrementNumberByTen",
          "title": "%command.incrementNumberByTen%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.decrementNumberByOneTenth",
          "title": "%command.decrementNumberByOneTenth%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.decrementNumberByOne",
          "title": "%command.decrementNumberByOne%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.decrementNumberByTen",
          "title": "%command.decrementNumberByTen%",
          "category": "Emmet"
        },
        {
          "command": "editor.emmet.action.reflectCSSValue",
          "title": "%command.reflectCSSValue%",
          "category": "Emmet"
        },
        {
          "command": "workbench.action.showEmmetCommands",
          "title": "%command.showEmmetCommands%",
          "category": ""
        }
      ],
      "menus": {
        "commandPalette": [
          {
            "command": "editor.emmet.action.wrapWithAbbreviation",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.removeTag",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.updateTag",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.matchTag",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.balanceIn",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.balanceOut",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.prevEditPoint",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.nextEditPoint",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.mergeLines",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.selectPrevItem",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.selectNextItem",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.splitJoinTag",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.toggleComment",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.evaluateMathExpression",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.updateImageSize",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.incrementNumberByOneTenth",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.incrementNumberByOne",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.incrementNumberByTen",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.decrementNumberByOneTenth",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.decrementNumberByOne",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.decrementNumberByTen",
            "when": "!activeEditorIsReadonly"
          },
          {
            "command": "editor.emmet.action.reflectCSSValue",
            "when": "!activeEditorIsReadonly"
          }
        ]
      }
    },
    "browser": "./dist/browser/emmetBrowserMain"
  },
  "defaultPkgNlsJSON": {
    "description": "Emmet support for VS Code",
    "command.wrapWithAbbreviation": "Wrap with Abbreviation",
    "command.removeTag": "Remove Tag",
    "command.updateTag": "Update Tag",
    "command.matchTag": "Go to Matching Pair",
    "command.balanceIn": "Balance (inward)",
    "command.balanceOut": "Balance (outward)",
    "command.prevEditPoint": "Go to Previous Edit Point",
    "command.nextEditPoint": "Go to Next Edit Point",
    "command.mergeLines": "Merge Lines",
    "command.selectPrevItem": "Select Previous Item",
    "command.selectNextItem": "Select Next Item",
    "command.splitJoinTag": "Split/Join Tag",
    "command.toggleComment": "Toggle Comment",
    "command.evaluateMathExpression": "Evaluate Math Expression",
    "command.updateImageSize": "Update Image Size",
    "command.reflectCSSValue": "Reflect CSS Value",
    "command.incrementNumberByOne": "Increment by 1",
    "command.decrementNumberByOne": "Decrement by 1",
    "command.incrementNumberByOneTenth": "Increment by 0.1",
    "command.decrementNumberByOneTenth": "Decrement by 0.1",
    "command.incrementNumberByTen": "Increment by 10",
    "command.decrementNumberByTen": "Decrement by 10",
    "command.showEmmetCommands": "Show Emmet Commands",
    "emmetSyntaxProfiles": "Define profile for specified syntax or use your own profile with specific rules.",
    "emmetExclude": "An array of languages where Emmet abbreviations should not be expanded.",
    "emmetExtensionsPath": "An array of paths, where each path can contain Emmet syntaxProfiles and/or snippet files.\nIn case of conflicts, the profiles/snippets of later paths will override those of earlier paths.\nSee https://code.visualstudio.com/docs/editor/emmet for more information and an example snippet file.",
    "emmetExtensionsPathItem": "A path containing Emmet syntaxProfiles and/or snippets.",
    "emmetShowExpandedAbbreviation": "Shows expanded Emmet abbreviations as suggestions.\nThe option `\"inMarkupAndStylesheetFilesOnly\"` applies to html, haml, jade, slim, xml, xsl, css, scss, sass, less and stylus.\nThe option `\"always\"` applies to all parts of the file regardless of markup/css.",
    "emmetShowAbbreviationSuggestions": "Shows possible Emmet abbreviations as suggestions. Not applicable in stylesheets or when emmet.showExpandedAbbreviation is set to `\"never\"`.",
    "emmetIncludeLanguages": "Enable Emmet abbreviations in languages that are not supported by default. Add a mapping here between the language and Emmet supported language.\n For example: `{\"vue-html\": \"html\", \"javascript\": \"javascriptreact\"}`",
    "emmetVariables": "Variables to be used in Emmet snippets.",
    "emmetTriggerExpansionOnTab": "When enabled, Emmet abbreviations are expanded when pressing TAB.",
    "emmetPreferences": "Preferences used to modify behavior of some actions and resolvers of Emmet.",
    "emmetPreferencesIntUnit": "Default unit for integer values.",
    "emmetPreferencesFloatUnit": "Default unit for float values.",
    "emmetPreferencesCssAfter": "Symbol to be placed at the end of CSS property when expanding CSS abbreviations.",
    "emmetPreferencesSassAfter": "Symbol to be placed at the end of CSS property when expanding CSS abbreviations in Sass files.",
    "emmetPreferencesStylusAfter": "Symbol to be placed at the end of CSS property when expanding CSS abbreviations in Stylus files.",
    "emmetPreferencesCssBetween": "Symbol to be placed at the between CSS property and value when expanding CSS abbreviations.",
    "emmetPreferencesSassBetween": "Symbol to be placed at the between CSS property and value when expanding CSS abbreviations in Sass files.",
    "emmetPreferencesStylusBetween": "Symbol to be placed at the between CSS property and value when expanding CSS abbreviations in Stylus files.",
    "emmetShowSuggestionsAsSnippets": "If `true`, then Emmet suggestions will show up as snippets allowing you to order them as per `#editor.snippetSuggestions#` setting.",
    "emmetPreferencesBemElementSeparator": "Element separator used for classes when using the BEM filter.",
    "emmetPreferencesBemModifierSeparator": "Modifier separator used for classes when using the BEM filter.",
    "emmetPreferencesFilterCommentBefore": "A definition of comment that should be placed before matched element when comment filter is applied.",
    "emmetPreferencesFilterCommentAfter": "A definition of comment that should be placed after matched element when comment filter is applied.",
    "emmetPreferencesFilterCommentTrigger": "A comma-separated list of attribute names that should exist in the abbreviation for the comment filter to be applied.",
    "emmetPreferencesFormatNoIndentTags": "An array of tag names that should never get inner indentation.",
    "emmetPreferencesFormatForceIndentTags": "An array of tag names that should always get inner indentation.",
    "emmetPreferencesAllowCompactBoolean": "If `true`, compact notation of boolean attributes are produced.",
    "emmetPreferencesCssWebkitProperties": "Comma separated CSS properties that get the 'webkit' vendor prefix when used in Emmet abbreviation that starts with `-`. Set to empty string to always avoid the 'webkit' prefix.",
    "emmetPreferencesCssMozProperties": "Comma separated CSS properties that get the 'moz' vendor prefix when used in Emmet abbreviation that starts with `-`. Set to empty string to always avoid the 'moz' prefix.",
    "emmetPreferencesCssOProperties": "Comma separated CSS properties that get the 'o' vendor prefix when used in Emmet abbreviation that starts with `-`. Set to empty string to always avoid the 'o' prefix.",
    "emmetPreferencesCssMsProperties": "Comma separated CSS properties that get the 'ms' vendor prefix when used in Emmet abbreviation that starts with `-`. Set to empty string to always avoid the 'ms' prefix.",
    "emmetPreferencesCssFuzzySearchMinScore": "The minimum score (from 0 to 1) that fuzzy-matched abbreviation should achieve. Lower values may produce many false-positive matches, higher values may reduce possible matches.",
    "emmetOptimizeStylesheetParsing": "When set to `false`, the whole file is parsed to determine if current position is valid for expanding Emmet abbreviations. When set to `true`, only the content around the current position in CSS/SCSS/Less files is parsed.",
    "emmetPreferencesOutputInlineBreak": "The number of sibling inline elements needed for line breaks to be placed between those elements. If `0`, inline elements are always expanded onto a single line.",
    "emmetPreferencesOutputReverseAttributes": "If `true`, reverses attribute merging directions when resolving snippets.",
    "emmetPreferencesOutputSelfClosingStyle": "Style of self-closing tags: html (`<br>`), xml (`<br/>`) or xhtml (`<br />`).",
    "emmetPreferencesCssColorShort": "If `true`, color values like `#f` will be expanded to `#fff` instead of `#ffffff`."
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json"
  ],
  "mode": "public"
}
