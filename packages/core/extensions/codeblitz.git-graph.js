module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "git-graph",
    "version": "1.30.0-3"
  },
  "packageJSON": {
    "name": "git-graph",
    "publisher": "codeblitz",
    "version": "1.30.0-3",
    "repository": {
      "type": "git",
      "url": "https://github.com/mhutchie/vscode-git-graph.git"
    },
    "displayName": "Git Graph",
    "description": "View a Git Graph of your repository, and perform Git actions from the graph.",
    "icon": "resources/icon.png",
    "activationEvents": [
      "*"
    ],
    "sumiContributes": {
      "workerMain": "./dist/extension.js"
    },
    "contributes": {
      "commands": [
        {
          "category": "Git Graph",
          "command": "git-graph.view",
          "title": "View Git Graph (git log)",
          "icon": {
            "light": "resources/cmd-icon-light.svg",
            "dark": "resources/cmd-icon-dark.svg"
          }
        },
        {
          "category": "Git Graph",
          "command": "git-graph.endAllWorkspaceCodeReviews",
          "title": "End All Code Reviews in Workspace"
        },
        {
          "category": "Git Graph",
          "command": "git-graph.endSpecificWorkspaceCodeReview",
          "title": "End a specific Code Review in Workspace..."
        },
        {
          "category": "Git Graph",
          "command": "git-graph.openFile",
          "title": "Open File",
          "icon": "$(go-to-file)",
          "enablement": "isInDiffEditor && resourceScheme == git-graph && git-graph:codiconsSupported"
        }
      ],
      "configuration": {
        "type": "object",
        "title": "Git Graph",
        "properties": {
          "git-graph.commitDetailsView.autoCenter": {
            "type": "boolean",
            "default": true,
            "description": "Automatically center the Commit Details View when it is opened."
          },
          "git-graph.commitDetailsView.fileView.fileTree.compactFolders": {
            "type": "boolean",
            "default": true,
            "description": "Render the File Tree in the Commit Details View in a compacted form, such that folders with a single child folder are compressed into a single combined folder element."
          },
          "git-graph.commitDetailsView.fileView.type": {
            "type": "string",
            "enum": [
              "File Tree",
              "File List"
            ],
            "enumDescriptions": [
              "Display files in a tree structure.",
              "Display files in a list (useful for repositories with deep folder structures)."
            ],
            "default": "File Tree",
            "description": "Sets the default type of File View used in the Commit Details View. This can be overridden per repository using the controls on the right side of the Commit Details View."
          },
          "git-graph.commitDetailsView.location": {
            "type": "string",
            "enum": [
              "Inline",
              "Docked to Bottom"
            ],
            "enumDescriptions": [
              "Show the Commit Details View inline with the graph & commits.",
              "Show the Commit Details View docked to the bottom of the Git Graph View."
            ],
            "default": "Inline",
            "description": "Specifies where the Commit Details View is rendered in the Git Graph View."
          },
          "git-graph.contextMenuActionsVisibility": {
            "type": "object",
            "default": {},
            "properties": {
              "branch": {
                "type": "object",
                "properties": {
                  "checkout": {
                    "type": "boolean",
                    "title": "Checkout Branch"
                  },
                  "rename": {
                    "type": "boolean",
                    "title": "Rename Branch..."
                  },
                  "delete": {
                    "type": "boolean",
                    "title": "Delete Branch..."
                  },
                  "merge": {
                    "type": "boolean",
                    "title": "Merge into current branch..."
                  },
                  "rebase": {
                    "type": "boolean",
                    "title": "Rebase current branch on Branch..."
                  },
                  "push": {
                    "type": "boolean",
                    "title": "Push Branch..."
                  },
                  "createPullRequest": {
                    "type": "boolean",
                    "title": "Create Pull Request..."
                  },
                  "createArchive": {
                    "type": "boolean",
                    "title": "Create Archive"
                  },
                  "selectInBranchesDropdown": {
                    "type": "boolean",
                    "title": "Select in Branches Dropdown"
                  },
                  "unselectInBranchesDropdown": {
                    "type": "boolean",
                    "title": "Unselect in Branches Dropdown"
                  },
                  "copyName": {
                    "type": "boolean",
                    "title": "Copy Branch Name to Clipboard"
                  }
                }
              },
              "commit": {
                "type": "object",
                "properties": {
                  "addTag": {
                    "type": "boolean",
                    "title": "Add Tag..."
                  },
                  "createBranch": {
                    "type": "boolean",
                    "title": "Create Branch..."
                  },
                  "checkout": {
                    "type": "boolean",
                    "title": "Checkout..."
                  },
                  "cherrypick": {
                    "type": "boolean",
                    "title": "Cherry Pick..."
                  },
                  "revert": {
                    "type": "boolean",
                    "title": "Revert..."
                  },
                  "drop": {
                    "type": "boolean",
                    "title": "Drop..."
                  },
                  "merge": {
                    "type": "boolean",
                    "title": "Merge into current branch..."
                  },
                  "rebase": {
                    "type": "boolean",
                    "title": "Rebase current branch on this Commit..."
                  },
                  "reset": {
                    "type": "boolean",
                    "title": "Reset current branch to this Commit..."
                  },
                  "copyHash": {
                    "type": "boolean",
                    "title": "Copy Commit Hash to Clipboard"
                  },
                  "copySubject": {
                    "type": "boolean",
                    "title": "Copy Commit Subject to Clipboard"
                  }
                }
              },
              "remoteBranch": {
                "type": "object",
                "properties": {
                  "checkout": {
                    "type": "boolean",
                    "title": "Checkout Branch..."
                  },
                  "delete": {
                    "type": "boolean",
                    "title": "Delete Remote Branch..."
                  },
                  "fetch": {
                    "type": "boolean",
                    "title": "Fetch into local branch..."
                  },
                  "merge": {
                    "type": "boolean",
                    "title": "Merge into current branch..."
                  },
                  "pull": {
                    "type": "boolean",
                    "title": "Pull into current branch..."
                  },
                  "createPullRequest": {
                    "type": "boolean",
                    "title": "Create Pull Request"
                  },
                  "createArchive": {
                    "type": "boolean",
                    "title": "Create Archive"
                  },
                  "selectInBranchesDropdown": {
                    "type": "boolean",
                    "title": "Select in Branches Dropdown"
                  },
                  "unselectInBranchesDropdown": {
                    "type": "boolean",
                    "title": "Unselect in Branches Dropdown"
                  },
                  "copyName": {
                    "type": "boolean",
                    "title": "Copy Branch Name to Clipboard"
                  }
                }
              },
              "stash": {
                "type": "object",
                "properties": {
                  "apply": {
                    "type": "boolean",
                    "title": "Apply Stash..."
                  },
                  "createBranch": {
                    "type": "boolean",
                    "title": "Create Branch from Stash..."
                  },
                  "pop": {
                    "type": "boolean",
                    "title": "Pop Stash..."
                  },
                  "drop": {
                    "type": "boolean",
                    "title": "Drop Stash..."
                  },
                  "copyName": {
                    "type": "boolean",
                    "title": "Copy Stash Name to Clipboard"
                  },
                  "copyHash": {
                    "type": "boolean",
                    "title": "Copy Stash Hash to Clipboard"
                  }
                }
              },
              "tag": {
                "type": "object",
                "properties": {
                  "viewDetails": {
                    "type": "boolean",
                    "title": "View Details"
                  },
                  "delete": {
                    "type": "boolean",
                    "title": "Delete Tag..."
                  },
                  "push": {
                    "type": "boolean",
                    "title": "Push Tag..."
                  },
                  "createArchive": {
                    "type": "boolean",
                    "title": "Create Archive"
                  },
                  "copyName": {
                    "type": "boolean",
                    "title": "Copy Tag Name to Clipboard"
                  }
                }
              },
              "uncommittedChanges": {
                "type": "object",
                "properties": {
                  "stash": {
                    "type": "boolean",
                    "title": "Stash uncommitted changes..."
                  },
                  "reset": {
                    "type": "boolean",
                    "title": "Reset uncommitted changes..."
                  },
                  "clean": {
                    "type": "boolean",
                    "title": "Clean untracked files..."
                  },
                  "openSourceControlView": {
                    "type": "boolean",
                    "title": "Open Source Control View"
                  }
                }
              }
            },
            "markdownDescription": "Customise which context menu actions are visible. For example, if you want to hide the rebase action from the branch context menu, a suitable value for this setting is `{ \"branch\": { \"rebase\": false } }`. For more information of how to configure this setting, view the documentation [here](https://github.com/mhutchie/vscode-git-graph/wiki/Extension-Settings#context-menu-actions-visibility)."
          },
          "git-graph.customBranchGlobPatterns": {
            "type": "array",
            "items": {
              "type": "object",
              "title": "Branch Glob Pattern",
              "required": [
                "name",
                "glob"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "title": "Name of pattern",
                  "description": "Name used to reference the pattern in the 'Branches' dropdown"
                },
                "glob": {
                  "type": "string",
                  "title": "Glob pattern",
                  "description": "The Glob Pattern <glob-pattern>, as used in 'git log --glob=<glob-pattern>'. For example: heads/feature/*"
                }
              }
            },
            "default": [],
            "description": "An array of Custom Branch Glob Patterns to be shown in the 'Branches' dropdown. Example: [{\"name\": \"Feature Requests\", \"glob\": \"heads/feature/*\"}]"
          },
          "git-graph.customEmojiShortcodeMappings": {
            "type": "array",
            "items": {
              "type": "object",
              "title": "Custom Emoji Shortcode Mapping",
              "required": [
                "shortcode",
                "emoji"
              ],
              "properties": {
                "shortcode": {
                  "type": "string",
                  "title": "Emoji Shortcode",
                  "description": "Emoji Shortcode (e.g. \":sparkles:\")"
                },
                "emoji": {
                  "type": "string",
                  "title": "Emoji",
                  "description": "Emoji (e.g. \"✨\")"
                }
              }
            },
            "default": [],
            "description": "An array of custom Emoji Shortcode mappings. Example: [{\"shortcode\": \":sparkles:\", \"emoji\":\"✨\"}]"
          },
          "git-graph.customPullRequestProviders": {
            "type": "array",
            "items": {
              "type": "object",
              "title": "Pull Request Provider",
              "required": [
                "name",
                "templateUrl"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "title": "Name of the Provider",
                  "description": "A unique, identifying, display name for the provider."
                },
                "templateUrl": {
                  "type": "string",
                  "title": "Template URL",
                  "markdownDescription": "A template URL that can be used to create a Pull Request, after the $1 - $8 variables have been substituted to construct the final URL. For information on how to configure this setting, see the documentation [here](https://github.com/mhutchie/vscode-git-graph/wiki/Configuring-a-custom-Pull-Request-Provider)."
                }
              }
            },
            "default": [],
            "markdownDescription": "An array of custom Pull Request providers that can be used in the \"Pull Request Creation\" Integration. For information on how to configure this setting, see the documentation [here](https://github.com/mhutchie/vscode-git-graph/wiki/Configuring-a-custom-Pull-Request-Provider)."
          },
          "git-graph.date.format": {
            "type": "string",
            "enum": [
              "Date & Time",
              "Date Only",
              "ISO Date & Time",
              "ISO Date Only",
              "Relative"
            ],
            "enumDescriptions": [
              "Show the date and time (e.g. \"24 Mar 2019 21:34\")",
              "Show the date only (e.g. \"24 Mar 2019\")",
              "Show the ISO date and time (e.g. \"2019-03-24 21:34\")",
              "Show the ISO date only (e.g. \"2019-03-24\")",
              "Show relative times (e.g. \"5 minutes ago\")"
            ],
            "default": "ISO Date & Time",
            "description": "Specifies the date format to be used in the \"Date\" column on the Git Graph View."
          },
          "git-graph.date.type": {
            "type": "string",
            "enum": [
              "Author Date",
              "Commit Date"
            ],
            "enumDescriptions": [
              "Use the author date of a commit.",
              "Use the committer date of a commit."
            ],
            "default": "Author Date",
            "description": "Specifies the date type to be displayed in the \"Date\" column on the Git Graph View."
          },
          "git-graph.defaultColumnVisibility": {
            "type": "object",
            "properties": {
              "Date": {
                "type": "boolean",
                "title": "Visibility of the Date column"
              },
              "Author": {
                "type": "boolean",
                "title": "Visibility of the Author column"
              },
              "Commit": {
                "type": "boolean",
                "title": "Visibility of the Commit column"
              }
            },
            "default": {
              "Date": true,
              "Author": true,
              "Commit": true
            },
            "description": "An object specifying the default visibility of the Date, Author & Commit columns. Example: {\"Date\": true, \"Author\": true, \"Commit\": true}"
          },
          "git-graph.dialog.addTag.pushToRemote": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the field indicating whether the tag should be pushed to a remote once it is added."
          },
          "git-graph.dialog.addTag.type": {
            "type": "string",
            "enum": [
              "Annotated",
              "Lightweight"
            ],
            "default": "Annotated",
            "description": "Default type of the tag being added."
          },
          "git-graph.dialog.applyStash.reinstateIndex": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Reinstate Index\" checkbox."
          },
          "git-graph.dialog.cherryPick.noCommit": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"No Commit\" checkbox."
          },
          "git-graph.dialog.cherryPick.recordOrigin": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Record Origin\" checkbox."
          },
          "git-graph.dialog.createBranch.checkOut": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Check out\" checkbox."
          },
          "git-graph.dialog.deleteBranch.forceDelete": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Force Delete\" checkbox."
          },
          "git-graph.dialog.fetchIntoLocalBranch.forceFetch": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Force Fetch\" checkbox."
          },
          "git-graph.dialog.fetchRemote.prune": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Prune\" checkbox."
          },
          "git-graph.dialog.fetchRemote.pruneTags": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Prune Tags\" checkbox."
          },
          "git-graph.dialog.general.referenceInputSpaceSubstitution": {
            "type": "string",
            "enum": [
              "None",
              "Hyphen",
              "Underscore"
            ],
            "enumDescriptions": [
              "Don't replace spaces.",
              "Replace space characters with hyphens, for example: \"new branch\" -> \"new-branch\".",
              "Replace space characters with underscores, for example: \"new branch\" -> \"new_branch\"."
            ],
            "default": "None",
            "description": "Specifies a substitution that is automatically performed when space characters are entered or pasted into reference inputs on dialogs (e.g. Create Branch, Add Tag, etc.)."
          },
          "git-graph.dialog.merge.noCommit": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"No Commit\" checkbox."
          },
          "git-graph.dialog.merge.noFastForward": {
            "type": "boolean",
            "default": true,
            "description": "Default state of the \"Create a new commit even if fast-forward is possible\" checkbox."
          },
          "git-graph.dialog.merge.squashCommits": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Squash Commits\" checkbox."
          },
          "git-graph.dialog.merge.squashMessageFormat": {
            "type": "string",
            "enum": [
              "Default",
              "Git SQUASH_MSG"
            ],
            "enumDescriptions": [
              "Use the squash message generated by Git Graph.",
              "Use the detailed squash message generated by Git (stored in .git/SQUASH_MSG)."
            ],
            "default": "Default",
            "description": "Specifies the message format used for the squashed commit (when the \"Squash Commits\" option is selected)."
          },
          "git-graph.dialog.popStash.reinstateIndex": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Reinstate Index\" checkbox."
          },
          "git-graph.dialog.pullBranch.noFastForward": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Create a new commit even if fast-forward is possible\" checkbox."
          },
          "git-graph.dialog.pullBranch.squashCommits": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Squash Commits\" checkbox."
          },
          "git-graph.dialog.pullBranch.squashMessageFormat": {
            "type": "string",
            "enum": [
              "Default",
              "Git SQUASH_MSG"
            ],
            "enumDescriptions": [
              "Use the squash message generated by Git Graph.",
              "Use the detailed squash message generated by Git (stored in .git/SQUASH_MSG)."
            ],
            "default": "Default",
            "description": "Specifies the message format used for the squashed commit (when the \"Squash Commits\" option is selected)."
          },
          "git-graph.dialog.rebase.ignoreDate": {
            "type": "boolean",
            "default": true,
            "description": "Default state of the \"Ignore Date (non-interactive rebase only)\" checkbox."
          },
          "git-graph.dialog.rebase.launchInteractiveRebase": {
            "type": "boolean",
            "default": false,
            "description": "Default state of the \"Launch Interactive Rebase in new Terminal\" checkbox."
          },
          "git-graph.dialog.resetCurrentBranchToCommit.mode": {
            "type": "string",
            "enum": [
              "Soft",
              "Mixed",
              "Hard"
            ],
            "enumDescriptions": [
              "Soft - Keep all changes, but reset head",
              "Mixed - Keep working tree, but reset index",
              "Hard - Discard all changes"
            ],
            "default": "Mixed",
            "description": "Default mode to be used for the reset action."
          },
          "git-graph.dialog.resetUncommittedChanges.mode": {
            "type": "string",
            "enum": [
              "Mixed",
              "Hard"
            ],
            "enumDescriptions": [
              "Mixed - Keep working tree, but reset index",
              "Hard - Discard all changes"
            ],
            "default": "Mixed",
            "description": "Default mode to be used for the reset action."
          },
          "git-graph.dialog.stashUncommittedChanges.includeUntracked": {
            "type": "boolean",
            "default": true,
            "description": "Default state of the \"Include Untracked\" checkbox."
          },
          "git-graph.enhancedAccessibility": {
            "type": "boolean",
            "default": false,
            "description": "Visual file change A|M|D|R|U indicators in the Commit Details View for users with colour blindness. In the future, this setting will enable any additional accessibility related features of Git Graph that aren't enabled by default."
          },
          "git-graph.fileEncoding": {
            "type": "string",
            "default": "utf8",
            "markdownDescription": "The character set encoding used when retrieving a specific version of repository files (e.g. in the Diff View). A list of all supported encodings can be found [here](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings).",
            "scope": "resource"
          },
          "git-graph.graph.colours": {
            "type": "array",
            "items": {
              "type": "string",
              "description": "Colour (HEX or RGB)",
              "pattern": "^\\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8}|rgb[a]?\\s*\\(\\d{1,3},\\s*\\d{1,3},\\s*\\d{1,3}\\))\\s*$"
            },
            "default": [
              "#0085d9",
              "#d9008f",
              "#00d90a",
              "#d98500",
              "#a300d9",
              "#ff0000",
              "#00d9cc",
              "#e138e8",
              "#85d900",
              "#dc5b23",
              "#6f24d6",
              "#ffcc00"
            ],
            "description": "Specifies the colours used on the graph."
          },
          "git-graph.graph.style": {
            "type": "string",
            "enum": [
              "rounded",
              "angular"
            ],
            "enumDescriptions": [
              "Use smooth curves when transitioning between branches on the graph.",
              "Use angular lines when transitioning between branches on the graph."
            ],
            "default": "rounded",
            "description": "Specifies the style of the graph."
          },
          "git-graph.graph.uncommittedChanges": {
            "type": "string",
            "enum": [
              "Open Circle at the Uncommitted Changes",
              "Open Circle at the Checked Out Commit"
            ],
            "enumDescriptions": [
              "Display the Uncommitted Changes as a grey open circle, connected to the commit referenced by HEAD with a solid grey line. The current file system's state is therefore always displayed as an open circle.",
              "Display the Uncommitted Changes as a grey closed circle, connected to the commit referenced by HEAD with a dotted grey line. The commit referenced by HEAD is therefore always displayed as an open circle."
            ],
            "default": "Open Circle at the Uncommitted Changes",
            "description": "Specifies how the Uncommitted Changes are displayed on the graph."
          },
          "git-graph.integratedTerminalShell": {
            "type": "string",
            "default": "",
            "description": "Specifies the path and filename of the Shell executable to be used by the Visual Studio Code Integrated Terminal, when it is opened by Git Graph. For example, to use Git Bash on Windows this setting would commonly be set to \"C:\\Program Files\\Git\\bin\\bash.exe\". If this setting is left blank, the default Shell is used.",
            "scope": "machine"
          },
          "git-graph.keyboardShortcut.find": {
            "type": "string",
            "enum": [
              "UNASSIGNED",
              "CTRL/CMD + A",
              "CTRL/CMD + B",
              "CTRL/CMD + C",
              "CTRL/CMD + D",
              "CTRL/CMD + E",
              "CTRL/CMD + F",
              "CTRL/CMD + G",
              "CTRL/CMD + H",
              "CTRL/CMD + I",
              "CTRL/CMD + J",
              "CTRL/CMD + K",
              "CTRL/CMD + L",
              "CTRL/CMD + M",
              "CTRL/CMD + N",
              "CTRL/CMD + O",
              "CTRL/CMD + P",
              "CTRL/CMD + Q",
              "CTRL/CMD + R",
              "CTRL/CMD + S",
              "CTRL/CMD + T",
              "CTRL/CMD + U",
              "CTRL/CMD + V",
              "CTRL/CMD + W",
              "CTRL/CMD + X",
              "CTRL/CMD + Y",
              "CTRL/CMD + Z"
            ],
            "default": "CTRL/CMD + F",
            "description": "The keybinding for the keyboard shortcut that opens the Find Widget in the Git Graph View."
          },
          "git-graph.keyboardShortcut.refresh": {
            "type": "string",
            "enum": [
              "UNASSIGNED",
              "CTRL/CMD + A",
              "CTRL/CMD + B",
              "CTRL/CMD + C",
              "CTRL/CMD + D",
              "CTRL/CMD + E",
              "CTRL/CMD + F",
              "CTRL/CMD + G",
              "CTRL/CMD + H",
              "CTRL/CMD + I",
              "CTRL/CMD + J",
              "CTRL/CMD + K",
              "CTRL/CMD + L",
              "CTRL/CMD + M",
              "CTRL/CMD + N",
              "CTRL/CMD + O",
              "CTRL/CMD + P",
              "CTRL/CMD + Q",
              "CTRL/CMD + R",
              "CTRL/CMD + S",
              "CTRL/CMD + T",
              "CTRL/CMD + U",
              "CTRL/CMD + V",
              "CTRL/CMD + W",
              "CTRL/CMD + X",
              "CTRL/CMD + Y",
              "CTRL/CMD + Z"
            ],
            "default": "CTRL/CMD + R",
            "description": "The keybinding for the keyboard shortcut that refreshes the Git Graph View."
          },
          "git-graph.keyboardShortcut.scrollToHead": {
            "type": "string",
            "enum": [
              "UNASSIGNED",
              "CTRL/CMD + A",
              "CTRL/CMD + B",
              "CTRL/CMD + C",
              "CTRL/CMD + D",
              "CTRL/CMD + E",
              "CTRL/CMD + F",
              "CTRL/CMD + G",
              "CTRL/CMD + H",
              "CTRL/CMD + I",
              "CTRL/CMD + J",
              "CTRL/CMD + K",
              "CTRL/CMD + L",
              "CTRL/CMD + M",
              "CTRL/CMD + N",
              "CTRL/CMD + O",
              "CTRL/CMD + P",
              "CTRL/CMD + Q",
              "CTRL/CMD + R",
              "CTRL/CMD + S",
              "CTRL/CMD + T",
              "CTRL/CMD + U",
              "CTRL/CMD + V",
              "CTRL/CMD + W",
              "CTRL/CMD + X",
              "CTRL/CMD + Y",
              "CTRL/CMD + Z"
            ],
            "default": "CTRL/CMD + H",
            "description": "The keybinding for the keyboard shortcut that scrolls the Git Graph View to be centered on the commit referenced by HEAD."
          },
          "git-graph.keyboardShortcut.scrollToStash": {
            "type": "string",
            "enum": [
              "UNASSIGNED",
              "CTRL/CMD + A",
              "CTRL/CMD + B",
              "CTRL/CMD + C",
              "CTRL/CMD + D",
              "CTRL/CMD + E",
              "CTRL/CMD + F",
              "CTRL/CMD + G",
              "CTRL/CMD + H",
              "CTRL/CMD + I",
              "CTRL/CMD + J",
              "CTRL/CMD + K",
              "CTRL/CMD + L",
              "CTRL/CMD + M",
              "CTRL/CMD + N",
              "CTRL/CMD + O",
              "CTRL/CMD + P",
              "CTRL/CMD + Q",
              "CTRL/CMD + R",
              "CTRL/CMD + S",
              "CTRL/CMD + T",
              "CTRL/CMD + U",
              "CTRL/CMD + V",
              "CTRL/CMD + W",
              "CTRL/CMD + X",
              "CTRL/CMD + Y",
              "CTRL/CMD + Z"
            ],
            "default": "CTRL/CMD + S",
            "description": "The keybinding for the keyboard shortcut that scrolls the Git Graph View to the first (or next) stash in the loaded commits. The Shift Key Modifier can be applied to this keybinding to scroll the Git Graph View to the last (or previous) stash in the loaded commits."
          },
          "git-graph.markdown": {
            "type": "boolean",
            "default": true,
            "description": "Parse and render a frequently used subset of inline Markdown formatting rules in commit messages and tag details (bold, italics, bold & italics, and inline code blocks)."
          },
          "git-graph.maxDepthOfRepoSearch": {
            "type": "number",
            "default": 0,
            "description": "Specifies the maximum depth of subfolders to search when discovering repositories in the workspace. Note: Sub-repos are not automatically detected when searching subfolders, however they can be manually added by running the command \"Git Graph: Add Git Repository\" in the Command Palette."
          },
          "git-graph.openNewTabEditorGroup": {
            "type": "string",
            "enum": [
              "Active",
              "Beside",
              "One",
              "Two",
              "Three",
              "Four",
              "Five",
              "Six",
              "Seven",
              "Eight",
              "Nine"
            ],
            "enumDescriptions": [
              "Open the new tab in the Active Editor Group.",
              "Open the new tab beside the Active Editor Group.",
              "Open the new tab in the First Editor Group.",
              "Open the new tab in the Second Editor Group.",
              "Open the new tab in the Third Editor Group.",
              "Open the new tab in the Fourth Editor Group.",
              "Open the new tab in the Fifth Editor Group.",
              "Open the new tab in the Sixth Editor Group.",
              "Open the new tab in the Seventh Editor Group.",
              "Open the new tab in the Eighth Editor Group.",
              "Open the new tab in the Ninth Editor Group."
            ],
            "default": "Active",
            "description": "Specifies the Editor Group where Git Graph should open new tabs, when performing the following actions from the Git Graph View: Viewing the Visual Studio Code Diff View, Opening a File, Viewing a File at a Specific Revision."
          },
          "git-graph.openToTheRepoOfTheActiveTextEditorDocument": {
            "type": "boolean",
            "default": false,
            "description": "Open the Git Graph View to the repository containing the active Text Editor document."
          },
          "git-graph.referenceLabels.alignment": {
            "type": "string",
            "enum": [
              "Normal",
              "Branches (on the left) & Tags (on the right)",
              "Branches (aligned to the graph) & Tags (on the right)"
            ],
            "enumDescriptions": [
              "Show branch & tag labels on the left of the commit message in the 'Description' column.",
              "Show branch labels on the left of the commit message in the 'Description' column, and tag labels on the right.",
              "Show branch labels aligned to the graph in the 'Graph' column, and tag labels on the right in the 'Description' column."
            ],
            "default": "Normal",
            "description": "Specifies how branch and tag reference labels are aligned for each commit."
          },
          "git-graph.referenceLabels.combineLocalAndRemoteBranchLabels": {
            "type": "boolean",
            "default": true,
            "description": "Combine local and remote branch labels if they refer to the same branch, and are on the same commit."
          },
          "git-graph.repository.commits.fetchAvatars": {
            "type": "boolean",
            "default": false,
            "description": "Fetch avatars of commit authors and committers. By enabling this setting, you consent to commit author and committer email addresses being sent GitHub, GitLab or Gravatar, depending on the repositories remote origin."
          },
          "git-graph.repository.commits.initialLoad": {
            "type": "number",
            "default": 100,
            "description": "Specifies the number of commits to initially load."
          },
          "git-graph.repository.commits.loadMore": {
            "type": "number",
            "default": 100,
            "description": "Specifies the number of additional commits to load when the \"Load More Commits\" button is pressed, or more commits are automatically loaded."
          },
          "git-graph.repository.commits.loadMoreAutomatically": {
            "type": "boolean",
            "default": true,
            "description": "When the view has been scrolled to the bottom, automatically load more commits if they exist (instead of having to press the \"Load More Commits\" button)."
          },
          "git-graph.repository.commits.mute.commitsThatAreNotAncestorsOfHead": {
            "type": "boolean",
            "default": false,
            "description": "Display commits that aren't ancestors of the checked-out branch / commit with a muted text color. Muting will only occur if the commit referenced by HEAD is within the loaded commits on the Git Graph View."
          },
          "git-graph.repository.commits.mute.mergeCommits": {
            "type": "boolean",
            "default": true,
            "description": "Display merge commits with a muted text color."
          },
          "git-graph.repository.commits.order": {
            "type": "string",
            "enum": [
              "date",
              "author-date",
              "topo"
            ],
            "enumDescriptions": [
              "Show commits in the commit timestamp order.",
              "Show commits in the author timestamp order.",
              "Avoid showing commits on multiple lines of history intermixed."
            ],
            "default": "date",
            "markdownDescription": "Specifies the order of commits on the Git Graph View. See [git log](https://git-scm.com/docs/git-log#_commit_ordering) for more information on each order option. This can be overridden per repository via the Git Graph View's Column Header Context Menu."
          },
          "git-graph.repository.commits.showSignatureStatus": {
            "type": "boolean",
            "default": false,
            "description": "Show the commit's signature status to the right of the Committer in the Commit Details View (only for signed commits). Hovering over the signature icon displays a tooltip with the signature details. Requires Git (>= 2.4.0) & GPG (or equivalent) to be installed on the same machine that is running Visual Studio Code."
          },
          "git-graph.repository.fetchAndPrune": {
            "type": "boolean",
            "default": false,
            "description": "Before fetching from remote(s) using the Fetch button on the Git Graph View Control Bar, remove any remote-tracking references that no longer exist on the remote(s)."
          },
          "git-graph.repository.fetchAndPruneTags": {
            "type": "boolean",
            "default": false,
            "description": "Before fetching from remote(s) using the Fetch button on the Git Graph View Control Bar, remove any local tags that no longer exist on the remote(s). Requires Git >= 2.17.0, and the \"Repository: Fetch And Prune\" setting to be enabled. Caution: If you work in repositories that have multiple remotes, it is not recommended to use this setting (instead you can prune tags for a specific remote via \"Fetch Remote\" Dialog from the Repository Settings Widget on the Git Graph View)."
          },
          "git-graph.repository.includeCommitsMentionedByReflogs": {
            "type": "boolean",
            "default": false,
            "description": "Include commits only mentioned by reflogs in the Git Graph View (only applies when showing all branches). This can be overridden per repository in the Git Graph View's Repository Settings Widget."
          },
          "git-graph.repository.onLoad.scrollToHead": {
            "type": "boolean",
            "default": false,
            "description": "Automatically scroll the Git Graph View to be centered on the commit referenced by HEAD. This will only occur if the commit referenced by HEAD is within the loaded commits on the Git Graph View."
          },
          "git-graph.repository.onLoad.showCheckedOutBranch": {
            "type": "boolean",
            "default": false,
            "description": "Show the checked out branch when a repository is loaded in the Git Graph View. This setting can be used in conjunction with \"Repository > On Load: Show Specific Branches\". Default: false (show all branches)"
          },
          "git-graph.repository.onLoad.showSpecificBranches": {
            "type": "array",
            "items": {
              "type": "string",
              "description": "A local branch name (e.g. \"master\"), a remote-tracking branch name prefixed with \"remotes/\" (e.g. \"remotes/origin/master\"), or a glob pattern defined in git-graph.customBranchGlobPatterns prefixed with \"--glob=\" (e.g. \"--glob=heads/feature/*\")."
            },
            "default": [],
            "markdownDescription": "Show specific branches when a repository is loaded in the Git Graph View. Branches can be specified as follows: A local branch name (e.g. `master`), a remote-tracking branch name prefixed with \"remotes/\" (e.g. `remotes/origin/master`), or a glob pattern defined in `git-graph.customBranchGlobPatterns` prefixed with \"--glob=\" (e.g. `--glob=heads/feature/*`). This setting can be used in conjunction with \"Repository > On Load: Show Checked Out Branch\". Default: [] (show all branches)"
          },
          "git-graph.repository.onlyFollowFirstParent": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "Only follow the first parent of commits when discovering the commits to load in the Git Graph View. See [--first-parent](https://git-scm.com/docs/git-log#Documentation/git-log.txt---first-parent) to find out more about this setting. This can be overridden per repository in the Git Graph View's Repository Settings Widget."
          },
          "git-graph.repository.showCommitsOnlyReferencedByTags": {
            "type": "boolean",
            "default": true,
            "description": "Show Commits that are only referenced by tags in Git Graph."
          },
          "git-graph.repository.showRemoteBranches": {
            "type": "boolean",
            "default": true,
            "description": "Show Remote Branches in Git Graph by default. This can be overridden per repository from the Git Graph View's Control Bar."
          },
          "git-graph.repository.showRemoteHeads": {
            "type": "boolean",
            "default": true,
            "description": "Show Remote HEAD Symbolic References in Git Graph (e.g. \"origin/HEAD\")."
          },
          "git-graph.repository.showStashes": {
            "type": "boolean",
            "default": true,
            "description": "Show Stashes in Git Graph by default. This can be overridden per repository in the Git Graph View's Repository Settings Widget."
          },
          "git-graph.repository.showTags": {
            "type": "boolean",
            "default": true,
            "description": "Show Tags in Git Graph by default. This can be overridden per repository in the Git Graph View's Repository Settings Widget."
          },
          "git-graph.repository.showUncommittedChanges": {
            "type": "boolean",
            "default": true,
            "description": "Show uncommitted changes. If you work on large repositories, disabling this setting can reduce the load time of the Git Graph View."
          },
          "git-graph.repository.showUntrackedFiles": {
            "type": "boolean",
            "default": true,
            "description": "Show untracked files when viewing the uncommitted changes. If you work on large repositories, disabling this setting can reduce the load time of the Git Graph View."
          },
          "git-graph.repository.sign.commits": {
            "type": "boolean",
            "default": false,
            "description": "Enables commit signing with GPG or X.509."
          },
          "git-graph.repository.sign.tags": {
            "type": "boolean",
            "default": false,
            "description": "Enables tag signing with GPG or X.509."
          },
          "git-graph.repository.useMailmap": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "Respect [.mailmap](https://git-scm.com/docs/git-check-mailmap#_mapping_authors) files when displaying author & committer names and email addresses."
          },
          "git-graph.repositoryDropdownOrder": {
            "type": "string",
            "enum": [
              "Full Path",
              "Name",
              "Workspace Full Path"
            ],
            "enumDescriptions": [
              "Sort repositories alphabetically by the full path of the repository.",
              "Sort repositories alphabetically by the name of the repository.",
              "Sort repositories according to the Visual Studio Code Workspace Folder order, then alphabetically by the full path of the repository."
            ],
            "default": "Workspace Full Path",
            "description": "Specifies the order that repositories are sorted in the repository dropdown on the Git Graph View (only visible when more than one repository exists in the current Visual Studio Code Workspace)."
          },
          "git-graph.retainContextWhenHidden": {
            "type": "boolean",
            "default": true,
            "description": "Specifies if the Git Graph View's Visual Studio Code context is kept when the panel is no longer visible (e.g. moved to background tab). Enabling this setting will make Git Graph load significantly faster when switching back to the Git Graph tab, however has a higher memory overhead."
          },
          "git-graph.showStatusBarItem": {
            "type": "boolean",
            "default": true,
            "description": "Show a Status Bar Item that opens the Git Graph View when clicked."
          },
          "git-graph.sourceCodeProviderIntegrationLocation": {
            "type": "string",
            "enum": [
              "Inline",
              "More Actions"
            ],
            "enumDescriptions": [
              "Show the 'View Git Graph' action on the title of SCM Providers",
              "Show the 'View Git Graph' action in the 'More Actions...' menu on the title of SCM Providers"
            ],
            "default": "Inline",
            "description": "Specifies where the \"View Git Graph\" action appears on the title of SCM Providers."
          },
          "git-graph.tabIconColourTheme": {
            "type": "string",
            "enum": [
              "colour",
              "grey"
            ],
            "enumDescriptions": [
              "Show a colour icon which suits most Visual Studio Code colour themes",
              "Show a grey icon which suits Visual Studio Code colour themes that are predominantly grayscale"
            ],
            "default": "colour",
            "description": "Specifies the colour theme of the icon displayed on the Git Graph tab."
          },
          "git-graph.autoCenterCommitDetailsView": {
            "type": "boolean",
            "default": true,
            "description": "Automatically center the commit details view when it is opened.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.commitDetailsView.autoCenter",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.commitDetailsView.autoCenter#`"
          },
          "git-graph.combineLocalAndRemoteBranchLabels": {
            "type": "boolean",
            "default": true,
            "description": "Combine local and remote branch labels if they refer to the same branch, and are on the same commit.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.referenceLabels.combineLocalAndRemoteBranchLabels",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.referenceLabels.combineLocalAndRemoteBranchLabels#`"
          },
          "git-graph.commitDetailsViewFileTreeCompactFolders": {
            "type": "boolean",
            "default": true,
            "description": "Render the File Tree in the Commit Details / Comparison View in a compacted form, such that folders with a single child folder are compressed into a single combined folder element.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.commitDetailsView.fileView.fileTree.compactFolders",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.commitDetailsView.fileView.fileTree.compactFolders#`"
          },
          "git-graph.commitDetailsViewLocation": {
            "type": "string",
            "enum": [
              "Inline",
              "Docked to Bottom"
            ],
            "enumDescriptions": [
              "Show the Commit Details View inline with the graph",
              "Show the Commit Details View docked to the bottom of the Git Graph view"
            ],
            "default": "Inline",
            "description": "Specifies where the Commit Details View is rendered in the Git Graph view.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.commitDetailsView.location",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.commitDetailsView.location#`"
          },
          "git-graph.commitOrdering": {
            "type": "string",
            "enum": [
              "date",
              "author-date",
              "topo"
            ],
            "enumDescriptions": [
              "Show commits in the commit timestamp order.",
              "Show commits in the author timestamp order.",
              "Avoid showing commits on multiple lines of history intermixed."
            ],
            "default": "date",
            "markdownDescription": "Specifies the order of commits on the Git Graph view. See [git log](https://git-scm.com/docs/git-log#_commit_ordering) for more information on each order option.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.commits.order",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.commits.order#`"
          },
          "git-graph.dateFormat": {
            "type": "string",
            "enum": [
              "Date & Time",
              "Date Only",
              "ISO Date & Time",
              "ISO Date Only",
              "Relative"
            ],
            "enumDescriptions": [
              "Show the date and time, for example \"24 Mar 2019 21:34\"",
              "Show the date only, for example \"24 Mar 2019\"",
              "Show the ISO date and time, for example \"2019-03-24 21:34\"",
              "Show the ISO date only, for example \"2019-03-24\"",
              "Show relative times, for example \"5 minutes ago\""
            ],
            "default": "ISO Date & Time",
            "description": "Specifies the date format to be used in the \"Date\" column on the Git Graph View.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.date.format",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.date.format#`"
          },
          "git-graph.dateType": {
            "type": "string",
            "enum": [
              "Author Date",
              "Commit Date"
            ],
            "enumDescriptions": [
              "Use the author date of a commit",
              "Use the committer date of a commit"
            ],
            "default": "Author Date",
            "description": "Specifies the date type to be displayed in the \"Date\" column on the Git Graph View.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.date.type",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.date.type#`"
          },
          "git-graph.defaultFileViewType": {
            "type": "string",
            "enum": [
              "File Tree",
              "File List"
            ],
            "enumDescriptions": [
              "Display files in a tree structure",
              "Display files in a list (useful for repositories with deep folder structures)"
            ],
            "default": "File Tree",
            "description": "Sets the default type of File View used in the Commit Details / Comparison Views. This can be overridden per repository using the controls on the right side of the Commit Details / Comparison Views.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.commitDetailsView.fileView.type",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.commitDetailsView.fileView.type#`"
          },
          "git-graph.fetchAndPrune": {
            "type": "boolean",
            "default": false,
            "description": "Before fetching from remote(s) using the Fetch button on the Git Graph View Control Bar, remove any remote-tracking references that no longer exist on the remote(s).",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.fetchAndPrune",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.fetchAndPrune#`"
          },
          "git-graph.fetchAvatars": {
            "type": "boolean",
            "default": false,
            "description": "Fetch avatars of commit authors and committers. By enabling this setting, you consent to commit author and committer email addresses being sent GitHub, GitLab or Gravatar, depending on the repositories remote origin.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.commits.fetchAvatars",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.commits.fetchAvatars#`"
          },
          "git-graph.graphColours": {
            "type": "array",
            "items": {
              "type": "string",
              "description": "Colour (HEX or RGB)",
              "pattern": "^\\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8}|rgb[a]?\\s*\\(\\d{1,3},\\s*\\d{1,3},\\s*\\d{1,3}\\))\\s*$"
            },
            "default": [
              "#0085d9",
              "#d9008f",
              "#00d90a",
              "#d98500",
              "#a300d9",
              "#ff0000",
              "#00d9cc",
              "#e138e8",
              "#85d900",
              "#dc5b23",
              "#6f24d6",
              "#ffcc00"
            ],
            "description": "Specifies the colours used on the graph.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.graph.colours",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.graph.colours#`"
          },
          "git-graph.graphStyle": {
            "type": "string",
            "enum": [
              "rounded",
              "angular"
            ],
            "enumDescriptions": [
              "Use smooth curves when transitioning between branches on the graph",
              "Use angular lines when transitioning between branches on the graph"
            ],
            "default": "rounded",
            "description": "Specifies the style of the graph.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.graph.style",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.graph.style#`"
          },
          "git-graph.includeCommitsMentionedByReflogs": {
            "type": "boolean",
            "default": false,
            "description": "Include commits only mentioned by reflogs in the Git Graph View (only applies when showing all branches). This can be overridden per repository in the Git Graph View's Repository Settings Widget.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.includeCommitsMentionedByReflogs",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.includeCommitsMentionedByReflogs#`"
          },
          "git-graph.initialLoadCommits": {
            "type": "number",
            "default": 100,
            "description": "Specifies the number of commits to initially load.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.commits.initialLoad",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.commits.initialLoad#`"
          },
          "git-graph.loadMoreCommits": {
            "type": "number",
            "default": 100,
            "description": "Specifies the number of additional commits to load when the \"Load More Commits\" button is pressed, or more commits are automatically loaded.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.commits.loadMore",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.commits.loadMore#`"
          },
          "git-graph.loadMoreCommitsAutomatically": {
            "type": "boolean",
            "default": true,
            "description": "When the view has been scrolled to the bottom, automatically load more commits if they exist (instead of having to press the \"Load More Commits\" button).",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.commits.loadMoreAutomatically",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.commits.loadMoreAutomatically#`"
          },
          "git-graph.muteCommitsThatAreNotAncestorsOfHead": {
            "type": "boolean",
            "default": false,
            "description": "Display commits that aren't ancestors of the checked-out branch / commit with a muted text color. Muting will only occur if the commit referenced by HEAD is within the loaded commits on the Git Graph View.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.commits.mute.commitsThatAreNotAncestorsOfHead",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.commits.mute.commitsThatAreNotAncestorsOfHead#`"
          },
          "git-graph.muteMergeCommits": {
            "type": "boolean",
            "default": true,
            "description": "Display merge commits with a muted text color.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.commits.mute.mergeCommits",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.commits.mute.mergeCommits#`"
          },
          "git-graph.onlyFollowFirstParent": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "Only follow the first parent of commits when discovering the commits to load in the Git Graph View. See [--first-parent](https://git-scm.com/docs/git-log#Documentation/git-log.txt---first-parent) to find out more about this setting.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.onlyFollowFirstParent",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.onlyFollowFirstParent#`"
          },
          "git-graph.openDiffTabLocation": {
            "type": "string",
            "enum": [
              "Active",
              "Beside",
              "One",
              "Two",
              "Three",
              "Four",
              "Five",
              "Six",
              "Seven",
              "Eight",
              "Nine"
            ],
            "enumDescriptions": [
              "Open the Visual Studio Code Diff View in the Active Editor Group.",
              "Open the Visual Studio Code Diff View beside the Active Editor Group.",
              "Open the Visual Studio Code Diff View in the First Editor Group.",
              "Open the Visual Studio Code Diff View in the Second Editor Group.",
              "Open the Visual Studio Code Diff View in the Third Editor Group.",
              "Open the Visual Studio Code Diff View in the Fourth Editor Group.",
              "Open the Visual Studio Code Diff View in the Fifth Editor Group.",
              "Open the Visual Studio Code Diff View in the Sixth Editor Group.",
              "Open the Visual Studio Code Diff View in the Seventh Editor Group.",
              "Open the Visual Studio Code Diff View in the Eighth Editor Group.",
              "Open the Visual Studio Code Diff View in the Ninth Editor Group."
            ],
            "default": "Active",
            "description": "Specifies which Editor Group the Visual Studio Code Diff View is opened in.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.openNewTabEditorGroup",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.openNewTabEditorGroup#`"
          },
          "git-graph.openRepoToHead": {
            "type": "boolean",
            "default": false,
            "description": "When opening or switching repositories in the Git Graph View, automatically scroll the view to be centered on the commit referenced by HEAD. This will only occur if the commit referenced by HEAD is within the loaded commits on the Git Graph View.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.onLoad.scrollToHead",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.onLoad.scrollToHead#`"
          },
          "git-graph.referenceLabelAlignment": {
            "type": "string",
            "enum": [
              "Normal",
              "Branches (on the left) & Tags (on the right)",
              "Branches (aligned to the graph) & Tags (on the right)"
            ],
            "enumDescriptions": [
              "Show branch & tag labels on the left of the commit message in the 'Description' column.",
              "Show branch labels on the left of the commit message in the 'Description' column, and tag labels on the right.",
              "Show branch labels aligned to the graph in the 'Graph' column, and tag labels on the right in the 'Description' column."
            ],
            "default": "Normal",
            "description": "Specifies how branch and tag reference labels are aligned for each commit.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.referenceLabels.alignment",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.referenceLabels.alignment#`"
          },
          "git-graph.showCommitsOnlyReferencedByTags": {
            "type": "boolean",
            "default": true,
            "description": "Show commits that are only referenced by tags in Git Graph.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.showCommitsOnlyReferencedByTags",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.showCommitsOnlyReferencedByTags#`"
          },
          "git-graph.showCurrentBranchByDefault": {
            "type": "boolean",
            "default": false,
            "description": "Show the current branch by default when Git Graph is opened. Default: false (show all branches)",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.onLoad.showCheckedOutBranch",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.onLoad.showCheckedOutBranch#`"
          },
          "git-graph.showSignatureStatus": {
            "type": "boolean",
            "default": false,
            "description": "Show the commit's signature status to the right of the Committer in the Commit Details View (only for signed commits). Hovering over the signature icon displays a tooltip with the signature details. Requires Git (>= 2.4.0) & GPG (or equivalent) to be installed on the same machine that is running Visual Studio Code.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.commits.showSignatureStatus",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.commits.showSignatureStatus#`"
          },
          "git-graph.showTags": {
            "type": "boolean",
            "default": true,
            "description": "Show Tags in Git Graph by default. This can be overridden per repository in the Git Graph View's Repository Settings Widget.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.showTags",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.showTags#`"
          },
          "git-graph.showUncommittedChanges": {
            "type": "boolean",
            "default": true,
            "description": "Show uncommitted changes. If you work on large repositories, disabling this setting can reduce the load time of the Git Graph View.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.showUncommittedChanges",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.showUncommittedChanges#`"
          },
          "git-graph.showUntrackedFiles": {
            "type": "boolean",
            "default": true,
            "description": "Show untracked files when viewing the uncommitted changes. If you work on large repositories, disabling this setting can reduce the load time of the Git Graph View.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.showUntrackedFiles",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.showUntrackedFiles#`"
          },
          "git-graph.useMailmap": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "Respect [.mailmap](https://git-scm.com/docs/git-check-mailmap#_mapping_authors) files when displaying author & committer names and email addresses.",
            "deprecationMessage": "Depreciated: This setting has been renamed to git-graph.repository.useMailmap",
            "markdownDeprecationMessage": "Depreciated: This setting has been renamed to `#git-graph.repository.useMailmap#`"
          }
        }
      },
      "menus": {
        "commandPalette": [
          {
            "command": "git-graph.openFile",
            "when": "isInDiffEditor && resourceScheme == git-graph && git-graph:codiconsSupported"
          }
        ],
        "editor/title": [
          {
            "command": "git-graph.openFile",
            "group": "navigation",
            "when": "isInDiffEditor && resourceScheme == git-graph && git-graph:codiconsSupported"
          }
        ],
        "scm/title": [
          {
            "when": "scmProvider == git && config.git-graph.sourceCodeProviderIntegrationLocation == 'Inline'",
            "command": "git-graph.view",
            "group": "navigation"
          },
          {
            "when": "scmProvider == git && config.git-graph.sourceCodeProviderIntegrationLocation == 'More Actions'",
            "command": "git-graph.view",
            "group": "inline"
          }
        ]
      },
      "workerMain": "./dist/extension.js"
    }
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json",
    "media/out.min.js",
    "media/out.min.css",
    "README.md",
    "resources/icon.png",
    "resources/webview-icon.svg",
    "resources/webview-icon-dark.svg",
    "resources/webview-icon-light.svg",
    "resources/cmd-icon-dark.svg",
    "resources/cmd-icon-light.svg",
    "dist/extension.js"
  ],
  "mode": "public"
}
