module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "anycode-rust",
    "version": "0.0.5"
  },
  "packageJSON": {
    "name": "anycode-rust",
    "publisher": "ms-vscode",
    "version": "0.0.5",
    "repository": {
      "url": "https://github.com/microsoft/vscode-anycode"
    },
    "displayName": "anycode-rust",
    "description": "Rust for Anycode",
    "contributes": {
      "anycodeLanguages": {
        "grammarPath": "./tree-sitter-rust.wasm",
        "languageId": "rust",
        "extensions": [
          "rs"
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
          "rust-lang.rust"
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
