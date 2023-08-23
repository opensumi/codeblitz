module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "anycode-typescript",
    "version": "0.0.5"
  },
  "packageJSON": {
    "name": "anycode-typescript",
    "publisher": "ms-vscode",
    "version": "0.0.5",
    "repository": {
      "url": "https://github.com/microsoft/vscode-anycode"
    },
    "displayName": "anycode-typescript",
    "description": "TypeScript for Anycode",
    "contributes": {
      "anycodeLanguages": {
        "grammarPath": "./tree-sitter-typescript.wasm",
        "languageId": "typescript",
        "extensions": [
          "ts"
        ],
        "queryPaths": {
          "comments": "./queries/comments.scm",
          "identifiers": "./queries/identifiers.scm",
          "locals": "./queries/locals.scm",
          "outline": "./queries/outline.scm",
          "references": "./queries/references.scm"
        },
        "suppressedBy": [
          "vscode.typescript-language-features"
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
