module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "anycode",
    "version": "0.0.67"
  },
  "packageJSON": {
    "name": "anycode",
    "publisher": "ms-vscode",
    "version": "0.0.67",
    "repository": {
      "url": "https://github.com/microsoft/vscode-anycode"
    },
    "displayName": "anycode",
    "description": "",
    "activationEvents": [
      "onStartupFinished",
      "onCommand:workbench.action.showAllSymbols"
    ],
    "contributes": {
      "configuration": {
        "title": "Anycode",
        "properties": {
          "anycode.symbolIndexSize": {
            "type": "number",
            "default": 500,
            "minimum": 0,
            "markdownDescription": "Size of the index that is used for features like symbol search and go to definition."
          },
          "anycode.language.features": {
            "markdownDescription": "Control the language features that anycode offers. This can be configured for each supported language: [Learn How to Do That](https://code.visualstudio.com/docs/getstarted/settings#_languagespecific-editor-settings)",
            "type": "object",
            "scope": "language-overridable",
            "additionalProperties": false,
            "properties": {
              "definitions": {
                "type": "boolean",
                "description": "Go to Definition based on identifiers and local variables"
              },
              "references": {
                "type": "boolean",
                "description": "Find References based on identifiers and local variables"
              },
              "workspaceSymbols": {
                "type": "boolean",
                "description": "Add symbols to workspace symbol search"
              },
              "highlights": {
                "type": "boolean",
                "description": "Highlight Occurrences of identifiers and local variables"
              },
              "outline": {
                "type": "boolean",
                "description": "Populate Outline, Quick-outline, and Breadcrumbs"
              },
              "completions": {
                "type": "boolean",
                "description": "Completions based on identifiers and symbol names"
              },
              "folding": {
                "type": "boolean",
                "description": "Fold sections of codes to a single line"
              },
              "diagnostics": {
                "type": "boolean",
                "description": "(experimental) Parse errors show as problems"
              }
            },
            "default": {
              "completions": true,
              "definitions": true,
              "references": true,
              "highlights": true,
              "outline": true,
              "workspaceSymbols": true,
              "folding": false,
              "diagnostics": false
            }
          }
        }
      }
    },
    "browser": "./dist/anycode.extension.browser.js"
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [],
  "mode": "public"
}
