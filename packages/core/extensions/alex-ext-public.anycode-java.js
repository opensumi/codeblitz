module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "anycode-java",
    "version": "0.0.5"
  },
  "packageJSON": {
    "name": "anycode-java",
    "publisher": "ms-vscode",
    "version": "0.0.5",
    "repository": {
      "url": "https://github.com/microsoft/vscode-anycode"
    },
    "displayName": "anycode-java",
    "description": "Java for Anycode",
    "contributes": {
      "anycodeLanguages": {
        "grammarPath": "./tree-sitter-java.wasm",
        "languageId": "java",
        "extensions": [
          "java"
        ],
        "queryPaths": {
          "comments": "./queries/comments.scm",
          "folding": "./queries/folding.scm",
          "identifiers": "./queries/identifiers.scm",
          "locals": "./queries/locals.scm",
          "outline": "./queries/outline.scm",
          "references": "./queries/references.scm"
        },
        "suppressedBy": [
          "redhat.java"
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
