module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "anycode-php",
    "version": "0.0.6"
  },
  "packageJSON": {
    "name": "anycode-php",
    "publisher": "ms-vscode",
    "version": "0.0.6",
    "repository": {
      "url": "https://github.com/microsoft/vscode-anycode"
    },
    "displayName": "anycode-php",
    "description": "PHP for Anycode",
    "contributes": {
      "anycodeLanguages": {
        "grammarPath": "./tree-sitter-php.wasm",
        "languageId": "php",
        "extensions": [
          "php",
          "php4",
          "php5",
          "phtml",
          "ctp"
        ],
        "queryPaths": {
          "comments": "./queries/comments.scm",
          "identifiers": "./queries/identifiers.scm",
          "locals": "./queries/locals.scm",
          "outline": "./queries/outline.scm",
          "references": "./queries/references.scm"
        },
        "suppressedBy": [
          "bmewburn.vscode-intelephense-client"
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
