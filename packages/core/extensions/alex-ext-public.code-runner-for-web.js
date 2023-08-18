module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "code-runner-for-web",
    "version": "0.1.5-patch.1"
  },
  "packageJSON": {
    "name": "code-runner-for-web",
    "publisher": "formulahendry",
    "version": "0.1.5-patch.1",
    "repository": {
      "type": "git",
      "url": "https://github.com/formulahendry/vscode-code-runner-for-web.git"
    },
    "displayName": "Code Runner for Web",
    "description": "Run Code (Python) in browser",
    "icon": "images/logo.png",
    "activationEvents": [
      "onCommand:code-runner-for-web.run"
    ],
    "contributes": {
      "commands": [
        {
          "command": "code-runner-for-web.run",
          "title": "Run Code in Web",
          "icon": "$(play)"
        }
      ],
      "menus": {
        "editor/context": [
          {
            "when": "resourceLangId == python && !inOutput",
            "command": "code-runner-for-web.run",
            "group": "navigation"
          }
        ],
        "editor/title/run": [
          {
            "when": "resourceLangId == python",
            "command": "code-runner-for-web.run",
            "group": "navigation"
          }
        ]
      }
    },
    "browser": "./dist/web/extension.js"
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json"
  ],
  "mode": "public"
}
