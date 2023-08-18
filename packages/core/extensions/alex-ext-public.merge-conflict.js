module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "merge-conflict",
    "version": "1.0.0"
  },
  "packageJSON": {
    "name": "merge-conflict",
    "publisher": "vscode",
    "version": "1.0.0",
    "repository": {
      "type": "git",
      "url": "https://github.com/microsoft/vscode.git"
    },
    "displayName": "%displayName%",
    "description": "%description%",
    "icon": "media/icon.png",
    "activationEvents": [
      "onStartupFinished"
    ],
    "contributes": {
      "commands": [
        {
          "category": "%command.category%",
          "title": "%command.accept.all-current%",
          "original": "Accept All Current",
          "command": "merge-conflict.accept.all-current"
        },
        {
          "category": "%command.category%",
          "title": "%command.accept.all-incoming%",
          "original": "Accept All Incoming",
          "command": "merge-conflict.accept.all-incoming"
        },
        {
          "category": "%command.category%",
          "title": "%command.accept.all-both%",
          "original": "Accept All Both",
          "command": "merge-conflict.accept.all-both"
        },
        {
          "category": "%command.category%",
          "title": "%command.accept.current%",
          "original": "Accept Current",
          "command": "merge-conflict.accept.current"
        },
        {
          "category": "%command.category%",
          "title": "%command.accept.incoming%",
          "original": "Accept Incoming",
          "command": "merge-conflict.accept.incoming"
        },
        {
          "category": "%command.category%",
          "title": "%command.accept.selection%",
          "original": "Accept Selection",
          "command": "merge-conflict.accept.selection"
        },
        {
          "category": "%command.category%",
          "title": "%command.accept.both%",
          "original": "Accept Both",
          "command": "merge-conflict.accept.both"
        },
        {
          "category": "%command.category%",
          "title": "%command.next%",
          "original": "Next Conflict",
          "command": "merge-conflict.next",
          "icon": "$(arrow-down)"
        },
        {
          "category": "%command.category%",
          "title": "%command.previous%",
          "original": "Previous Conflict",
          "command": "merge-conflict.previous",
          "icon": "$(arrow-up)"
        },
        {
          "category": "%command.category%",
          "title": "%command.compare%",
          "original": "Compare Current Conflict",
          "command": "merge-conflict.compare"
        }
      ],
      "menus": {
        "scm/resourceState/context": [
          {
            "command": "merge-conflict.accept.all-current",
            "when": "scmProvider == git && scmResourceGroup == merge",
            "group": "1_modification"
          },
          {
            "command": "merge-conflict.accept.all-incoming",
            "when": "scmProvider == git && scmResourceGroup == merge",
            "group": "1_modification"
          }
        ],
        "editor/title": [
          {
            "command": "merge-conflict.previous",
            "group": "navigation@1",
            "when": "mergeConflictsCount && mergeConflictsCount != 0"
          },
          {
            "command": "merge-conflict.next",
            "group": "navigation@2",
            "when": "mergeConflictsCount && mergeConflictsCount != 0"
          }
        ]
      },
      "configuration": {
        "title": "%config.title%",
        "properties": {
          "merge-conflict.codeLens.enabled": {
            "type": "boolean",
            "description": "%config.codeLensEnabled%",
            "default": true
          },
          "merge-conflict.decorators.enabled": {
            "type": "boolean",
            "description": "%config.decoratorsEnabled%",
            "default": true
          },
          "merge-conflict.autoNavigateNextConflict.enabled": {
            "type": "boolean",
            "description": "%config.autoNavigateNextConflictEnabled%",
            "default": false
          },
          "merge-conflict.diffViewPosition": {
            "type": "string",
            "enum": [
              "Current",
              "Beside",
              "Below"
            ],
            "description": "%config.diffViewPosition%",
            "enumDescriptions": [
              "%config.diffViewPosition.current%",
              "%config.diffViewPosition.beside%",
              "%config.diffViewPosition.below%"
            ],
            "default": "Current"
          }
        }
      }
    },
    "browser": "./dist/browser/mergeConflictMain"
  },
  "defaultPkgNlsJSON": {
    "displayName": "Merge Conflict",
    "description": "Highlighting and commands for inline merge conflicts.",
    "command.category": "Merge Conflict",
    "command.accept.all-current": "Accept All Current",
    "command.accept.all-incoming": "Accept All Incoming",
    "command.accept.all-both": "Accept All Both",
    "command.accept.current": "Accept Current",
    "command.accept.incoming": "Accept Incoming",
    "command.accept.selection": "Accept Selection",
    "command.accept.both": "Accept Both",
    "command.next": "Next Conflict",
    "command.previous": "Previous Conflict",
    "command.compare": "Compare Current Conflict",
    "config.title": "Merge Conflict",
    "config.autoNavigateNextConflictEnabled": "Whether to automatically navigate to the next merge conflict after resolving a merge conflict.",
    "config.codeLensEnabled": "Create a CodeLens for merge conflict blocks within editor.",
    "config.decoratorsEnabled": "Create decorators for merge conflict blocks within editor.",
    "config.diffViewPosition": "Controls where the diff view should be opened when comparing changes in merge conflicts.",
    "config.diffViewPosition.current": "Open the diff view in the current editor group.",
    "config.diffViewPosition.beside": "Open the diff view next to the current editor group.",
    "config.diffViewPosition.below": "Open the diff view below the current editor group."
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json"
  ],
  "mode": "public"
}
