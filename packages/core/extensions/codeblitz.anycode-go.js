module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "anycode-go",
    "version": "0.0.5"
  },
  "packageJSON": {
    "name": "anycode-go",
    "publisher": "ms-vscode",
    "version": "0.0.5",
    "repository": {
      "url": "https://github.com/microsoft/vscode-anycode"
    },
    "displayName": "anycode-go",
    "description": "Go for Anycode",
    "contributes": {
      "anycodeLanguages": {
        "grammarPath": "./tree-sitter-go.wasm",
        "languageId": "go",
        "extensions": [
          "go"
        ],
        "queryPaths": {
          "comments": "./queries/comments.scm",
          "identifiers": "./queries/identifiers.scm",
          "locals": "./queries/locals.scm",
          "outline": "./queries/outline.scm",
          "references": "./queries/references.scm"
        },
        "suppressedBy": [
          "golang.Go"
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
