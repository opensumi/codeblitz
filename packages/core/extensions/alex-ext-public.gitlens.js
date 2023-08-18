module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "gitlens",
    "version": "10.2.3-2"
  },
  "packageJSON": {
    "name": "gitlens",
    "publisher": "alex-ext-public",
    "version": "10.2.3-2",
    "description": "gitlens for alex",
    "icon": "images/gitlens-icon.png",
    "activationEvents": [
      "*"
    ],
    "contributes": {
      "configuration": {
        "type": "object",
        "title": "GitLens — Use 'GitLens: Open Settings' for a richer, interactive experience",
        "properties": {
          "gitlens.blame.avatars": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to show avatar images in the gutter blame annotations",
            "scope": "window"
          },
          "gitlens.blame.compact": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to compact (deduplicate) matching adjacent gutter blame annotations",
            "scope": "window"
          },
          "gitlens.blame.dateFormat": {
            "type": [
              "string",
              "null"
            ],
            "default": null,
            "markdownDescription": "Specifies how to format absolute dates (e.g. using the `${date}` token) in gutter blame annotations. See the [Moment.js docs](https://momentjs.com/docs/#/displaying/format/) for valid formats",
            "scope": "window"
          },
          "gitlens.defaultGravatarsStyle": {
            "type": "string",
            "default": "robohash",
            "enum": [
              "identicon",
              "mp",
              "monsterid",
              "retro",
              "robohash",
              "wavatar"
            ],
            "enumDescriptions": [
              "A geometric pattern",
              "A simple, cartoon-style silhouetted outline of a person (does not vary by email hash)",
              "A monster with different colors, faces, etc",
              "8-bit arcade-style pixelated faces",
              "A robot with different colors, faces, etc",
              "A face with differing features and backgrounds"
            ],
            "markdownDescription": "Specifies the style of the gravatar default (fallback) images",
            "scope": "window"
          },
          "gitlens.blame.format": {
            "type": "string",
            "default": "${message|40?} ${agoOrDate|14-}",
            "markdownDescription": "Specifies the format of the gutter blame annotations. See [_Commit Tokens_](https://github.com/eamodio/vscode-gitlens/wiki/Custom-Formatting#commit-tokens) in the GitLens docs. Date formatting is controlled by the `#gitlens.blame.dateFormat#` setting",
            "scope": "window"
          },
          "gitlens.blame.heatmap.enabled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide a heatmap indicator in the gutter blame annotations",
            "scope": "window"
          },
          "gitlens.blame.heatmap.location": {
            "type": "string",
            "default": "right",
            "enum": [
              "left",
              "right"
            ],
            "enumDescriptions": [
              "Adds a heatmap indicator on the left edge of the gutter blame annotations",
              "Adds a heatmap indicator on the right edge of the gutter blame annotations"
            ],
            "markdownDescription": "Specifies where the heatmap indicators will be shown in the gutter blame annotations",
            "scope": "window"
          },
          "gitlens.blame.highlight.enabled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to highlight lines associated with the current line",
            "scope": "window"
          },
          "gitlens.blame.highlight.locations": {
            "type": "array",
            "default": [
              "gutter",
              "line",
              "overview"
            ],
            "items": {
              "type": "string",
              "enum": [
                "gutter",
                "line",
                "overview"
              ],
              "enumDescriptions": [
                "Adds a gutter glyph",
                "Adds a full-line highlight background color",
                "Adds a decoration to the overview ruler (scroll bar)"
              ]
            },
            "minItems": 1,
            "maxItems": 3,
            "uniqueItems": true,
            "markdownDescription": "Specifies where the associated line highlights will be shown",
            "scope": "window"
          },
          "gitlens.blame.ignoreWhitespace": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "Specifies whether to ignore whitespace when comparing revisions during blame operations",
            "scope": "resource"
          },
          "gitlens.blame.separateLines": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether gutter blame annotations will be separated by a small gap",
            "scope": "window"
          },
          "gitlens.blame.toggleMode": {
            "type": "string",
            "default": "file",
            "enum": [
              "file",
              "window"
            ],
            "enumDescriptions": [
              "Toggles each file individually",
              "Toggles the window, i.e. all files at once"
            ],
            "markdownDescription": "Specifies how the gutter blame annotations will be toggled",
            "scope": "window"
          },
          "gitlens.codeLens.authors.command": {
            "type": "string",
            "default": "gitlens.toggleFileBlame",
            "enum": [
              "gitlens.toggleFileBlame",
              "gitlens.diffWithPrevious",
              "gitlens.revealCommitInView",
              "gitlens.showCommitsInView",
              "gitlens.showQuickCommitDetails",
              "gitlens.showQuickCommitFileDetails",
              "gitlens.showQuickFileHistory",
              "gitlens.showQuickRepoHistory"
            ],
            "enumDescriptions": [
              "Toggles file blame annotations",
              "Compares the current committed file with the previous commit",
              "Reveals the commit in the Repositories view",
              "Shows the commits within the range in the Search Commits view",
              "Shows a commit details quick pick",
              "Shows a commit file details quick pick",
              "Shows a file history quick pick",
              "Shows a branch history quick pick"
            ],
            "markdownDescription": "Specifies the command to be executed when an _authors_ code lens is clicked",
            "scope": "window"
          },
          "gitlens.codeLens.authors.enabled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide an _authors_ code lens, showing number of authors of the file or code block and the most prominent author (if there is more than one)",
            "scope": "window"
          },
          "gitlens.codeLens.enabled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide any Git code lens, by default. Use the `Toggle Git Code Lens` command (`gitlens.toggleCodeLens`) to toggle the Git code lens on and off for the current window",
            "scope": "window"
          },
          "gitlens.codeLens.includeSingleLineSymbols": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "Specifies whether to provide any Git code lens on symbols that span only a single line",
            "scope": "window"
          },
          "gitlens.codeLens.recentChange.command": {
            "type": "string",
            "default": "gitlens.toggleFileBlame",
            "enum": [
              "gitlens.toggleFileBlame",
              "gitlens.diffWithPrevious",
              "gitlens.revealCommitInView",
              "gitlens.showCommitsInView",
              "gitlens.showQuickCommitDetails",
              "gitlens.showQuickCommitFileDetails",
              "gitlens.showQuickFileHistory",
              "gitlens.showQuickRepoHistory"
            ],
            "enumDescriptions": [
              "Toggles file blame annotations",
              "Compares the current committed file with the previous commit",
              "Reveals the commit in the Repositories view",
              "Shows the commit in the Search Commits view",
              "Shows a commit details quick pick",
              "Shows a commit file details quick pick",
              "Shows a file history quick pick",
              "Shows a branch history quick pick"
            ],
            "markdownDescription": "Specifies the command to be executed when a _recent change_ code lens is clicked",
            "scope": "window"
          },
          "gitlens.codeLens.recentChange.enabled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide a _recent change_ code lens, showing the author and date of the most recent commit for the file or code block",
            "scope": "window"
          },
          "gitlens.codeLens.scopes": {
            "type": "array",
            "default": [
              "document",
              "containers"
            ],
            "items": {
              "type": "string",
              "enum": [
                "document",
                "containers",
                "blocks"
              ],
              "enumDescriptions": [
                "Adds code lens at the top of the document",
                "Adds code lens at the start of container-like symbols (modules, classes, interfaces, etc)",
                "Adds code lens at the start of block-like symbols (functions, methods, etc) lines"
              ]
            },
            "minItems": 1,
            "maxItems": 4,
            "uniqueItems": true,
            "markdownDescription": "Specifies where Git code lens will be shown in the document",
            "scope": "resource"
          },
          "gitlens.codeLens.scopesByLanguage": {
            "type": "array",
            "default": [
              {
                "language": "azure-pipelines",
                "scopes": [
                  "document"
                ]
              },
              {
                "language": "ansible",
                "scopes": [
                  "document"
                ]
              },
              {
                "language": "css",
                "scopes": [
                  "document"
                ]
              },
              {
                "language": "html",
                "scopes": [
                  "document"
                ]
              },
              {
                "language": "json",
                "scopes": [
                  "document"
                ]
              },
              {
                "language": "jsonc",
                "scopes": [
                  "document"
                ]
              },
              {
                "language": "less",
                "scopes": [
                  "document"
                ]
              },
              {
                "language": "postcss",
                "scopes": [
                  "document"
                ]
              },
              {
                "language": "python",
                "symbolScopes": [
                  "!Module"
                ]
              },
              {
                "language": "scss",
                "scopes": [
                  "document"
                ]
              },
              {
                "language": "stylus",
                "scopes": [
                  "document"
                ]
              },
              {
                "language": "vue",
                "scopes": [
                  "document"
                ]
              },
              {
                "language": "yaml",
                "scopes": [
                  "document"
                ]
              }
            ],
            "items": {
              "type": "object",
              "required": [
                "language"
              ],
              "properties": {
                "language": {
                  "type": "string",
                  "description": "Specifies the language to which this code lens override applies"
                },
                "scopes": {
                  "type": "array",
                  "default": [
                    "document",
                    "containers"
                  ],
                  "items": {
                    "type": "string",
                    "enum": [
                      "document",
                      "containers",
                      "blocks",
                      "custom"
                    ],
                    "enumDescriptions": [
                      "Adds code lens at the top of the document",
                      "Adds code lens at the start of container-like symbols (modules, classes, interfaces, etc)",
                      "Adds code lens at the start of block-like symbols (functions, methods, properties, etc) lines",
                      "Adds code lens at the start of symbols contained in `symbolScopes`"
                    ]
                  },
                  "minItems": 1,
                  "maxItems": 4,
                  "uniqueItems": true,
                  "description": "Specifies where Git code lens will be shown in the document for the specified language"
                },
                "symbolScopes": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "uniqueItems": true,
                  "description": "Specifies the set of document symbols where Git code lens will be shown in the document for the specified language. Must be a member of `SymbolKind`"
                }
              }
            },
            "uniqueItems": true,
            "markdownDescription": "Specifies where Git code lens will be shown in the document for the specified languages",
            "scope": "resource"
          },
          "gitlens.codeLens.symbolScopes": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "uniqueItems": true,
            "markdownDescription": "Specifies a set of document symbols where Git code lens will or will not be shown in the document. Prefix with `!` to avoid providing a Git code lens for the symbol. Must be a member of `SymbolKind`",
            "scope": "resource"
          },
          "gitlens.heatmap.ageThreshold": {
            "type": "string",
            "default": "90",
            "markdownDescription": "Specifies the age of the most recent change (in days) after which the gutter heatmap annotations will be cold rather than hot (i.e. will use `#gitlens.heatmap.coldColor#` instead of `#gitlens.heatmap.hotColor#`)",
            "scope": "window"
          },
          "gitlens.heatmap.coldColor": {
            "type": "string",
            "default": "#0a60f6",
            "markdownDescription": "Specifies the base color of the gutter heatmap annotations when the most recent change is older (cold) than the `#gitlens.heatmap.ageThreshold#` value",
            "scope": "window"
          },
          "gitlens.heatmap.hotColor": {
            "type": "string",
            "default": "#f66a0a",
            "markdownDescription": "Specifies the base color of the gutter heatmap annotations when the most recent change is newer (hot) than the `#gitlens.heatmap.ageThreshold#` value",
            "scope": "window"
          },
          "gitlens.heatmap.toggleMode": {
            "type": "string",
            "default": "file",
            "enum": [
              "file",
              "window"
            ],
            "enumDescriptions": [
              "Toggles each file individually",
              "Toggles the window, i.e. all files at once"
            ],
            "markdownDescription": "Specifies how the gutter heatmap annotations will be toggled",
            "scope": "window"
          },
          "gitlens.hovers.annotations.changes": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide a _changes (diff)_ hover for all lines when showing blame annotations",
            "scope": "window"
          },
          "gitlens.hovers.annotations.details": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide a _commit details_ hover for all lines when showing blame annotations",
            "scope": "window"
          },
          "gitlens.hovers.annotations.enabled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide any hovers when showing blame annotations",
            "scope": "window"
          },
          "gitlens.hovers.annotations.over": {
            "type": "string",
            "default": "line",
            "enum": [
              "annotation",
              "line"
            ],
            "enumDescriptions": [
              "Only shown when hovering over the line annotation",
              "Shown when hovering anywhere over the line"
            ],
            "markdownDescription": "Specifies when to trigger hovers when showing blame annotations",
            "scope": "window"
          },
          "gitlens.hovers.currentLine.changes": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide a _changes (diff)_ hover for the current line",
            "scope": "window"
          },
          "gitlens.hovers.currentLine.details": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide a _commit details_ hover for the current line",
            "scope": "window"
          },
          "gitlens.hovers.currentLine.enabled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide any hovers for the current line",
            "scope": "window"
          },
          "gitlens.hovers.currentLine.over": {
            "type": "string",
            "default": "annotation",
            "enum": [
              "annotation",
              "line"
            ],
            "enumDescriptions": [
              "Only shown when hovering over the line annotation",
              "Shown when hovering anywhere over the line"
            ],
            "markdownDescription": "Specifies when to trigger hovers for the current line",
            "scope": "window"
          },
          "gitlens.hovers.avatars": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to show avatar images in hovers",
            "scope": "window"
          },
          "gitlens.hovers.changesDiff": {
            "type": "string",
            "default": "line",
            "enum": [
              "line",
              "hunk"
            ],
            "enumDescriptions": [
              "Shows only the changes to the line",
              "Shows the set of related changes"
            ],
            "markdownDescription": "Specifies whether to show just the changes to the line or the set of related changes in the _changes (diff)_ hover",
            "scope": "window"
          },
          "gitlens.hovers.detailsMarkdownFormat": {
            "type": "string",
            "default": "${avatar} &nbsp;__${author}__, ${ago} &nbsp; _(${date})_ \n\n${message}\n\n${commands}",
            "markdownDescription": "Specifies the format (in markdown) of the _commit details_ hover. See [_Commit Tokens_](https://github.com/eamodio/vscode-gitlens/wiki/Custom-Formatting#commit-tokens) in the GitLens docs",
            "scope": "window"
          },
          "gitlens.hovers.enabled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide any hovers",
            "scope": "window"
          },
          "gitlens.currentLine.dateFormat": {
            "type": [
              "string",
              "null"
            ],
            "default": null,
            "markdownDescription": "Specifies how to format absolute dates (e.g. using the `${date}` token) for the current line blame annotation. See the [Moment.js docs](https://momentjs.com/docs/#/displaying/format/) for valid formats",
            "scope": "window"
          },
          "gitlens.currentLine.enabled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide a blame annotation for the current line, by default. Use the `Toggle Line Blame Annotations` command (`gitlens.toggleLineBlame`) to toggle the annotations on and off for the current window",
            "scope": "window"
          },
          "gitlens.currentLine.format": {
            "type": "string",
            "default": "${author}, ${agoOrDate} • ${message}",
            "markdownDescription": "Specifies the format of the current line blame annotation. See [_Commit Tokens_](https://github.com/eamodio/vscode-gitlens/wiki/Custom-Formatting#commit-tokens) in the GitLens docs. Date formatting is controlled by the `#gitlens.currentLine.dateFormat#` setting",
            "scope": "window"
          },
          "gitlens.currentLine.scrollable": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether the current line blame annotation can be scrolled into view when it is outside the viewport",
            "scope": "window"
          },
          "gitlens.defaultDateFormat": {
            "type": [
              "string",
              "null"
            ],
            "default": null,
            "markdownDescription": "Specifies how absolute dates will be formatted by default. See the [Moment.js docs](https://momentjs.com/docs/#/displaying/format/) for valid formats",
            "scope": "window"
          },
          "gitlens.menus": {
            "anyOf": [
              {
                "enum": [
                  false
                ]
              },
              {
                "type": "object",
                "properties": {
                  "editor": {
                    "anyOf": [
                      {
                        "enum": [
                          false
                        ]
                      },
                      {
                        "type": "object",
                        "properties": {
                          "blame": {
                            "type": "boolean"
                          },
                          "clipboard": {
                            "type": "boolean"
                          },
                          "compare": {
                            "type": "boolean"
                          },
                          "details": {
                            "type": "boolean"
                          },
                          "history": {
                            "type": "boolean"
                          },
                          "remote": {
                            "type": "boolean"
                          }
                        }
                      }
                    ]
                  },
                  "editorGroup": {
                    "anyOf": [
                      {
                        "enum": [
                          false
                        ]
                      },
                      {
                        "type": "object",
                        "properties": {
                          "blame": {
                            "type": "boolean"
                          },
                          "compare": {
                            "type": "boolean"
                          }
                        }
                      }
                    ]
                  },
                  "editorTab": {
                    "anyOf": [
                      {
                        "enum": [
                          false
                        ]
                      },
                      {
                        "type": "object",
                        "properties": {
                          "clipboard": {
                            "type": "boolean"
                          },
                          "compare": {
                            "type": "boolean"
                          },
                          "history": {
                            "type": "boolean"
                          },
                          "remote": {
                            "type": "boolean"
                          }
                        }
                      }
                    ]
                  },
                  "explorer": {
                    "anyOf": [
                      {
                        "enum": [
                          false
                        ]
                      },
                      {
                        "type": "object",
                        "properties": {
                          "clipboard": {
                            "type": "boolean"
                          },
                          "compare": {
                            "type": "boolean"
                          },
                          "history": {
                            "type": "boolean"
                          },
                          "remote": {
                            "type": "boolean"
                          }
                        }
                      }
                    ]
                  },
                  "scmGroup": {
                    "anyOf": [
                      {
                        "enum": [
                          false
                        ]
                      },
                      {
                        "type": "object",
                        "properties": {
                          "compare": {
                            "type": "boolean"
                          },
                          "openClose": {
                            "type": "boolean"
                          },
                          "stash": {
                            "type": "boolean"
                          },
                          "stashInline": {
                            "type": "boolean"
                          }
                        }
                      }
                    ]
                  },
                  "scmItem": {
                    "anyOf": [
                      {
                        "enum": [
                          false
                        ]
                      },
                      {
                        "type": "object",
                        "properties": {
                          "clipboard": {
                            "type": "boolean"
                          },
                          "compare": {
                            "type": "boolean"
                          },
                          "history": {
                            "type": "boolean"
                          },
                          "remote": {
                            "type": "boolean"
                          },
                          "stash": {
                            "type": "boolean"
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ],
            "default": {
              "editor": {
                "blame": false,
                "clipboard": true,
                "compare": true,
                "details": false,
                "history": false,
                "remote": false
              },
              "editorGroup": {
                "blame": true,
                "compare": true
              },
              "editorTab": {
                "clipboard": true,
                "compare": true,
                "history": true,
                "remote": true
              },
              "explorer": {
                "clipboard": true,
                "compare": true,
                "history": true,
                "remote": true
              },
              "scmGroup": {
                "compare": true,
                "openClose": true,
                "stash": true,
                "stashInline": true
              },
              "scmItem": {
                "clipboard": true,
                "compare": true,
                "history": true,
                "remote": true,
                "stash": true
              }
            },
            "markdownDescription": "Specifies which commands will be added to which menus",
            "scope": "window"
          },
          "gitlens.statusBar.alignment": {
            "type": "string",
            "default": "right",
            "enum": [
              "left",
              "right"
            ],
            "enumDescriptions": [
              "Aligns to the left",
              "Aligns to the right"
            ],
            "markdownDescription": "Specifies the blame alignment in the status bar",
            "scope": "window"
          },
          "gitlens.statusBar.command": {
            "type": "string",
            "default": "gitlens.toggleFileBlame",
            "enum": [
              "gitlens.toggleFileBlame",
              "gitlens.diffWithPrevious",
              "gitlens.diffWithWorking",
              "gitlens.toggleCodeLens",
              "gitlens.revealCommitInView",
              "gitlens.showCommitsInView",
              "gitlens.showQuickCommitDetails",
              "gitlens.showQuickCommitFileDetails",
              "gitlens.showQuickFileHistory",
              "gitlens.showQuickRepoHistory"
            ],
            "enumDescriptions": [
              "Toggles file blame annotations",
              "Compares the current line commit with the previous",
              "Compares the current line commit with the working tree",
              "Toggles Git code lens",
              "Reveals the commit in the Repositories view",
              "Shows the commit in the Search Commits view",
              "Shows a commit details quick pick",
              "Shows a commit file details quick pick",
              "Shows a file history quick pick",
              "Shows a branch history quick pick"
            ],
            "markdownDescription": "Specifies the command to be executed when the blame status bar item is clicked",
            "scope": "window"
          },
          "gitlens.statusBar.dateFormat": {
            "type": [
              "string",
              "null"
            ],
            "default": null,
            "markdownDescription": "Specifies how to format absolute dates (e.g. using the `${date}` token) in the blame information in the status bar. See the [Moment.js docs](https://momentjs.com/docs/#/displaying/format/) for valid formats",
            "scope": "window"
          },
          "gitlens.statusBar.enabled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether to provide blame information in the status bar",
            "scope": "window"
          },
          "gitlens.statusBar.format": {
            "type": "string",
            "default": "${author}, ${agoOrDate}",
            "markdownDescription": "Specifies the format of the blame information in the status bar. See [_Commit Tokens_](https://github.com/eamodio/vscode-gitlens/wiki/Custom-Formatting#commit-tokens) in the GitLens docs. Date formatting is controlled by the `#gitlens.statusBar.dateFormat#` setting",
            "scope": "window"
          },
          "gitlens.statusBar.reduceFlicker": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "Specifies whether to avoid clearing the previous blame information when changing lines to reduce status bar \"flashing\"",
            "scope": "window"
          },
          "gitlens.advanced.abbreviatedShaLength": {
            "type": "number",
            "default": "7",
            "markdownDescription": "Specifies the length of abbreviated commit ids (shas)",
            "scope": "window"
          },
          "gitlens.advanced.caching.enabled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "Specifies whether git output will be cached — changing the default is not recommended",
            "scope": "window"
          },
          "gitlens.strings.codeLens.unsavedChanges.recentChangeAndAuthors": {
            "type": "string",
            "default": "Unsaved changes (cannot determine recent change or authors)",
            "markdownDescription": "Specifies the string to be shown in place of both the _recent change_ and _authors_ code lens when there are unsaved changes",
            "scope": "window"
          },
          "gitlens.strings.codeLens.unsavedChanges.recentChangeOnly": {
            "type": "string",
            "default": "Unsaved changes (cannot determine recent change)",
            "markdownDescription": "Specifies the string to be shown in place of the _recent change_ code lens when there are unsaved changes",
            "scope": "window"
          },
          "gitlens.strings.codeLens.unsavedChanges.authorsOnly": {
            "type": "string",
            "default": "Unsaved changes (cannot determine authors)",
            "markdownDescription": "Specifies the string to be shown in place of the _authors_ code lens when there are unsaved changes",
            "scope": "window"
          }
        }
      },
      "colors": [
        {
          "id": "gitlens.gutterBackgroundColor",
          "description": "Specifies the background color of the gutter blame annotations",
          "defaults": {
            "dark": "#FFFFFF13",
            "light": "#0000000C",
            "highContrast": "#FFFFFF13"
          }
        },
        {
          "id": "gitlens.gutterForegroundColor",
          "description": "Specifies the foreground color of the gutter blame annotations",
          "defaults": {
            "dark": "#BEBEBE",
            "light": "#747474",
            "highContrast": "#BEBEBE"
          }
        },
        {
          "id": "gitlens.gutterUncommittedForegroundColor",
          "description": "Specifies the foreground color of an uncommitted line in the gutter blame annotations",
          "defaults": {
            "dark": "#00BCF299",
            "light": "#00BCF299",
            "highContrast": "#00BCF2FF"
          }
        },
        {
          "id": "gitlens.trailingLineBackgroundColor",
          "description": "Specifies the background color of the blame annotation for the current line",
          "defaults": {
            "dark": "#00000000",
            "light": "#00000000",
            "highContrast": "#00000000"
          }
        },
        {
          "id": "gitlens.trailingLineForegroundColor",
          "description": "Specifies the foreground color of the blame annotation for the current line",
          "defaults": {
            "dark": "#99999959",
            "light": "#99999959",
            "highContrast": "#99999999"
          }
        },
        {
          "id": "gitlens.lineHighlightBackgroundColor",
          "description": "Specifies the background color of the associated line highlights in blame annotations",
          "defaults": {
            "dark": "#00BCF233",
            "light": "#00BCF233",
            "highContrast": "#00BCF233"
          }
        },
        {
          "id": "gitlens.lineHighlightOverviewRulerColor",
          "description": "Specifies the overview ruler color of the associated line highlights in blame annotations",
          "defaults": {
            "dark": "#00BCF299",
            "light": "#00BCF299",
            "highContrast": "#00BCF299"
          }
        }
      ],
      "commands": [
        {
          "command": "gitlens.toggleFileBlame",
          "title": "Toggle File Blame Annotations",
          "category": "GitLens",
          "icon": {
            "dark": "https://gw-office.alipayobjects.com/bmw-prod/39117ff0-105c-49bd-ae19-0106ffb6b9fe.svg",
            "light": "https://gw-office.alipayobjects.com/bmw-prod/b3851f06-962c-4503-8128-8708019db479.svg"
          }
        },
        {
          "command": "gitlens.clearFileAnnotations",
          "title": "Clear File Annotations",
          "category": "GitLens",
          "icon": {
            "dark": "https://gw-office.alipayobjects.com/bmw-prod/4b7bdd61-169f-4b15-acd9-eac19192db22.svg",
            "light": "https://gw-office.alipayobjects.com/bmw-prod/e999bc23-09eb-46fd-8687-7df43c4cde98.svg"
          }
        },
        {
          "command": "gitlens.computingFileAnnotations",
          "title": "Computing File Annotations...",
          "category": "GitLens",
          "icon": {
            "dark": "https://gw-office.alipayobjects.com/bmw-prod/6ffe1baf-0110-4a87-97f0-23347221de26.svg",
            "light": "https://gw-office.alipayobjects.com/bmw-prod/5f23cedb-14a2-4454-ab58-78b415cec511.svg"
          }
        },
        {
          "command": "gitlens.toggleFileHeatmap",
          "title": "Toggle File Heatmap Annotations",
          "category": "GitLens",
          "icon": {
            "dark": "images/dark/icon-git.svg",
            "light": "images/light/icon-git.svg"
          }
        }
      ],
      "menus": {
        "commandPalette": [
          {
            "command": "gitlens.toggleFileBlame",
            "when": "gitlens:activeFileStatus =~ /blameable/"
          },
          {
            "command": "gitlens.clearFileAnnotations",
            "when": "gitlens:activeFileStatus =~ /blameable/ && gitlens:annotationStatus == computed"
          }
        ],
        "editor/context": [
          {
            "command": "gitlens.toggleFileBlame",
            "when": "editorTextFocus && gitlens:activeFileStatus =~ /blameable/ && config.gitlens.menus.editor.blame",
            "group": "2_gitlens@2"
          }
        ],
        "editor/title": [
          {
            "command": "gitlens.toggleFileBlame",
            "alt": "gitlens.toggleFileHeatmap",
            "when": "gitlens:activeFileStatus =~ /blameable/ && !gitlens:annotationStatus && config.gitlens.menus.editorGroup.blame",
            "group": "navigation@100"
          },
          {
            "command": "gitlens.computingFileAnnotations",
            "when": "gitlens:activeFileStatus =~ /blameable/ && gitlens:annotationStatus == computing && config.gitlens.menus.editorGroup.blame",
            "group": "navigation@100"
          },
          {
            "command": "gitlens.clearFileAnnotations",
            "when": "gitlens:activeFileStatus =~ /blameable/ && gitlens:annotationStatus == computed && config.gitlens.menus.editorGroup.blame",
            "group": "navigation@100"
          }
        ]
      },
      "keybindings": [
        {
          "command": "gitlens.key.left",
          "key": "left",
          "when": "gitlens:key:left"
        },
        {
          "command": "gitlens.key.alt+left",
          "key": "alt+left",
          "when": "gitlens:key:alt+left"
        },
        {
          "command": "gitlens.key.ctrl+left",
          "key": "ctrl+left",
          "mac": "cmd+left",
          "when": "gitlens:key:ctrl+left"
        },
        {
          "command": "gitlens.key.right",
          "key": "right",
          "when": "gitlens:key:right"
        },
        {
          "command": "gitlens.key.alt+right",
          "key": "alt+right",
          "when": "gitlens:key:alt+right"
        },
        {
          "command": "gitlens.key.ctrl+right",
          "key": "ctrl+right",
          "mac": "cmd+right",
          "when": "gitlens:key:ctrl+right"
        },
        {
          "command": "gitlens.key.alt+,",
          "key": "alt+,",
          "when": "gitlens:key:,"
        },
        {
          "command": "gitlens.key.alt+.",
          "key": "alt+.",
          "when": "gitlens:key:."
        },
        {
          "command": "gitlens.key.escape",
          "key": "escape",
          "when": "gitlens:key:escape && editorTextFocus && !findWidgetVisible && !renameInputVisible && !suggestWidgetVisible && !isInEmbeddedEditor"
        },
        {
          "command": "gitlens.toggleFileBlame",
          "key": "alt+b",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:activeFileStatus =~ /blameable/"
        },
        {
          "command": "gitlens.toggleCodeLens",
          "key": "shift+alt+b",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:enabled && gitlens:canToggleCodeLens"
        },
        {
          "command": "gitlens.showLastQuickPick",
          "key": "alt+-",
          "when": "config.gitlens.keymap == alternate && gitlens:enabled"
        },
        {
          "command": "gitlens.showCommitSearch",
          "key": "alt+/",
          "when": "config.gitlens.keymap == alternate && gitlens:enabled"
        },
        {
          "command": "gitlens.showQuickFileHistory",
          "key": "alt+h",
          "when": "config.gitlens.keymap == alternate && gitlens:enabled"
        },
        {
          "command": "gitlens.showQuickRepoHistory",
          "key": "shift+alt+h",
          "when": "config.gitlens.keymap == alternate && gitlens:enabled"
        },
        {
          "command": "gitlens.showQuickRepoStatus",
          "key": "alt+s",
          "when": "config.gitlens.keymap == alternate && gitlens:enabled"
        },
        {
          "command": "gitlens.showQuickCommitFileDetails",
          "key": "alt+c",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:enabled"
        },
        {
          "command": "gitlens.diffWithNext",
          "key": "alt+.",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:activeFileStatus =~ /revision/ && !isInDiffEditor"
        },
        {
          "command": "gitlens.diffWithNext",
          "key": "alt+.",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:activeFileStatus =~ /revision/ && isInDiffRightEditor"
        },
        {
          "command": "gitlens.diffWithNextInDiffLeft",
          "key": "alt+.",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:activeFileStatus =~ /revision/ && isInDiffLeftEditor"
        },
        {
          "command": "gitlens.diffWithPrevious",
          "key": "alt+,",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:activeFileStatus =~ /tracked/ && !isInDiffEditor"
        },
        {
          "command": "gitlens.diffWithPrevious",
          "key": "alt+,",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:activeFileStatus =~ /tracked/ && isInDiffLeftEditor"
        },
        {
          "command": "gitlens.diffWithPreviousInDiffRight",
          "key": "alt+,",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:activeFileStatus =~ /tracked/ && isInDiffRightEditor"
        },
        {
          "command": "gitlens.diffLineWithPrevious",
          "key": "shift+alt+,",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:activeFileStatus =~ /tracked/"
        },
        {
          "command": "gitlens.diffWithWorking",
          "key": "shift+alt+.",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:activeFileStatus =~ /revision/"
        },
        {
          "command": "gitlens.diffLineWithWorking",
          "key": "alt+w",
          "when": "config.gitlens.keymap == alternate && editorTextFocus && gitlens:activeFileStatus =~ /tracked/"
        },
        {
          "command": "gitlens.toggleFileBlame",
          "key": "ctrl+shift+g b",
          "mac": "cmd+alt+g b",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:activeFileStatus =~ /blameable/"
        },
        {
          "command": "gitlens.toggleCodeLens",
          "key": "ctrl+shift+g shift+b",
          "mac": "cmd+alt+g shift+b",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:enabled && gitlens:canToggleCodeLens"
        },
        {
          "command": "gitlens.showLastQuickPick",
          "key": "ctrl+shift+g -",
          "mac": "cmd+alt+g -",
          "when": "config.gitlens.keymap == chorded && gitlens:enabled"
        },
        {
          "command": "gitlens.showCommitSearch",
          "key": "ctrl+shift+g /",
          "mac": "cmd+alt+g /",
          "when": "config.gitlens.keymap == chorded && gitlens:enabled"
        },
        {
          "command": "gitlens.showQuickFileHistory",
          "key": "ctrl+shift+g h",
          "mac": "cmd+alt+g h",
          "when": "config.gitlens.keymap == chorded && gitlens:enabled"
        },
        {
          "command": "gitlens.showQuickRepoHistory",
          "key": "ctrl+shift+g shift+h",
          "mac": "cmd+alt+g shift+h",
          "when": "config.gitlens.keymap == chorded && gitlens:enabled"
        },
        {
          "command": "gitlens.showQuickRepoStatus",
          "key": "ctrl+shift+g s",
          "mac": "cmd+alt+g s",
          "when": "config.gitlens.keymap == chorded && gitlens:enabled"
        },
        {
          "command": "gitlens.showQuickCommitFileDetails",
          "key": "ctrl+shift+g c",
          "mac": "cmd+alt+g c",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:enabled"
        },
        {
          "command": "gitlens.diffWithNext",
          "key": "ctrl+shift+g .",
          "mac": "cmd+alt+g .",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:activeFileStatus =~ /revision/ && !isInDiffEditor"
        },
        {
          "command": "gitlens.diffWithNext",
          "key": "ctrl+shift+g .",
          "mac": "cmd+alt+g .",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:activeFileStatus =~ /revision/ && isInDiffRightEditor"
        },
        {
          "command": "gitlens.diffWithNextInDiffLeft",
          "key": "ctrl+shift+g .",
          "mac": "cmd+alt+g .",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:activeFileStatus =~ /revision/ && isInDiffLeftEditor"
        },
        {
          "command": "gitlens.diffWithPrevious",
          "key": "ctrl+shift+g ,",
          "mac": "cmd+alt+g ,",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:activeFileStatus =~ /tracked/ && !isInDiffEditor"
        },
        {
          "command": "gitlens.diffWithPrevious",
          "key": "ctrl+shift+g ,",
          "mac": "cmd+alt+g ,",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:activeFileStatus =~ /tracked/ && isInDiffLeftEditor"
        },
        {
          "command": "gitlens.diffWithPreviousInDiffRight",
          "key": "ctrl+shift+g ,",
          "mac": "cmd+alt+g ,",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:activeFileStatus =~ /tracked/ && isInDiffRightEditor"
        },
        {
          "command": "gitlens.diffLineWithPrevious",
          "key": "ctrl+shift+g shift+,",
          "mac": "cmd+alt+g shift+,",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:activeFileStatus =~ /tracked/"
        },
        {
          "command": "gitlens.diffWithWorking",
          "key": "ctrl+shift+g shift+.",
          "mac": "cmd+alt+g shift+.",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:activeFileStatus =~ /revision/"
        },
        {
          "command": "gitlens.diffLineWithWorking",
          "key": "ctrl+shift+g w",
          "mac": "cmd+alt+g w",
          "when": "config.gitlens.keymap == chorded && editorTextFocus && gitlens:activeFileStatus =~ /tracked/"
        },
        {
          "command": "workbench.view.scm",
          "key": "ctrl+shift+g g",
          "mac": "ctrl+shift+g",
          "when": "config.gitlens.keymap == chorded && gitlens:enabled"
        },
        {
          "command": "gitlens.views.repositories.copy",
          "key": "ctrl+c",
          "mac": "cmd+c",
          "when": "gitlens:enabled && focusedView =~ /^gitlens\\.views\\.repositories/"
        },
        {
          "command": "gitlens.views.fileHistory.copy",
          "key": "ctrl+c",
          "mac": "cmd+c",
          "when": "gitlens:enabled && focusedView =~ /^gitlens\\.views\\.fileHistory/"
        },
        {
          "command": "gitlens.views.lineHistory.copy",
          "key": "ctrl+c",
          "mac": "cmd+c",
          "when": "gitlens:enabled && focusedView =~ /^gitlens\\.views\\.lineHistory/"
        },
        {
          "command": "gitlens.views.compare.copy",
          "key": "ctrl+c",
          "mac": "cmd+c",
          "when": "gitlens:enabled && focusedView =~ /^gitlens\\.views\\.compare/"
        },
        {
          "command": "gitlens.views.search.copy",
          "key": "ctrl+c",
          "mac": "cmd+c",
          "when": "gitlens:enabled && focusedView =~ /^gitlens\\.views\\.search/"
        }
      ]
    }
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json",
    "README.md",
    "images/gitlens-icon.png",
    "dist/extension.js"
  ],
  "mode": "public"
}
