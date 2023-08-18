module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "anycode-python",
    "version": "0.0.5"
  },
  "packageJSON": {
    "name": "anycode-python",
    "publisher": "ms-vscode",
    "version": "0.0.5",
    "repository": {
      "url": "https://github.com/microsoft/vscode-anycode"
    },
    "displayName": "anycode-python",
    "description": "Python for Anycode",
    "contributes": {
      "anycodeLanguages": {
        "grammarPath": "./tree-sitter-python.wasm",
        "languageId": "python",
        "extensions": [
          "py",
          "rpy",
          "pyw",
          "cpy",
          "gyp",
          "gypi",
          "pyi",
          "ipy"
        ],
        "queryPaths": {
          "comments": "./queries/comments.scm",
          "identifiers": "./queries/identifiers.scm",
          "locals": "./queries/locals.scm",
          "outline": "./queries/outline.scm",
          "references": "./queries/references.scm"
        },
        "suppressedBy": [
          "ms-python.python"
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
