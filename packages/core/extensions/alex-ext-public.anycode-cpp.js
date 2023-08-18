module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "anycode-cpp",
    "version": "0.0.5"
  },
  "packageJSON": {
    "name": "anycode-cpp",
    "publisher": "ms-vscode",
    "version": "0.0.5",
    "repository": {
      "url": "https://github.com/microsoft/vscode-anycode"
    },
    "displayName": "anycode-cpp",
    "description": "C/C++ for Anycode",
    "contributes": {
      "anycodeLanguages": [
        {
          "grammarPath": "./tree-sitter-c.wasm",
          "languageId": "c",
          "extensions": [
            "c",
            "i"
          ],
          "queryPaths": {
            "comments": "./queries/c/comments.scm",
            "identifiers": "./queries/c/identifiers.scm",
            "outline": "./queries/c/outline.scm"
          },
          "suppressedBy": [
            "ms-vscode.cpptools"
          ]
        },
        {
          "grammarPath": "./tree-sitter-cpp.wasm",
          "languageId": "cpp",
          "extensions": [
            "cpp",
            "cc",
            "cxx",
            "c++",
            "hpp",
            "hh",
            "hxx",
            "h++",
            "h",
            "ii",
            "ino",
            "inl",
            "ipp",
            "ixx",
            "hpp.in",
            "h.in"
          ],
          "queryPaths": {
            "comments": "./queries/cpp/comments.scm",
            "identifiers": "./queries/cpp/identifiers.scm",
            "outline": "./queries/cpp/outline.scm"
          },
          "suppressedBy": [
            "ms-vscode.cpptools"
          ]
        }
      ]
    }
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [],
  "mode": "public"
}
