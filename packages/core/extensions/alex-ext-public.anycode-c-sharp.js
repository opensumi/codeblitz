module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "anycode-c-sharp",
    "version": "0.0.5"
  },
  "packageJSON": {
    "name": "anycode-c-sharp",
    "publisher": "ms-vscode",
    "version": "0.0.5",
    "repository": {
      "url": "https://github.com/microsoft/vscode-anycode"
    },
    "displayName": "anycode-c-sharp",
    "description": "C# for Anycode",
    "contributes": {
      "anycodeLanguages": {
        "grammarPath": "./tree-sitter-c_sharp.wasm",
        "languageId": "csharp",
        "extensions": [
          "cs"
        ],
        "queryPaths": {
          "comments": "./queries/comments.scm",
          "identifiers": "./queries/identifiers.scm",
          "locals": "./queries/locals.scm",
          "outline": "./queries/outline.scm",
          "references": "./queries/references.scm"
        },
        "suppressedBy": [
          "ms-dotnettools.csharp"
        ]
      }
    }
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [],
  "mode": "public"
}
