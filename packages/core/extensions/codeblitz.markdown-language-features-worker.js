module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "markdown-language-features-worker",
    "version": "1.53.0-patch.2"
  },
  "packageJSON": {
    "name": "markdown-language-features-worker",
    "publisher": "alex",
    "version": "1.53.0-patch.2",
    "displayName": "%displayName%",
    "description": "%description%",
    "icon": "icon.png",
    "activationEvents": [
      "onLanguage:markdown",
      "onCommand:markdown.preview.toggleLock",
      "onCommand:markdown.preview.refresh",
      "onCommand:markdown.showPreview",
      "onCommand:markdown.showPreviewToSide",
      "onCommand:markdown.showLockedPreviewToSide",
      "onCommand:markdown.showSource",
      "onCommand:markdown.showPreviewSecuritySelector",
      "onCommand:markdown.api.render",
      "onWebviewPanel:markdown.preview",
      "onCustomEditor:vscode.markdown.preview.editor"
    ],
    "sumiContributes": {
      "workerMain": "./dist/browser/extension.js"
    },
    "contributes": {
      "commands": [
        {
          "command": "markdown.showPreview",
          "title": "%markdown.preview.title%",
          "category": "Markdown",
          "icon": {
            "light": "./media/preview-light.svg",
            "dark": "./media/preview-dark.svg"
          }
        },
        {
          "command": "markdown.showPreviewToSide",
          "title": "%markdown.previewSide.title%",
          "category": "Markdown",
          "icon": "$(open-preview)"
        },
        {
          "command": "markdown.showLockedPreviewToSide",
          "title": "%markdown.showLockedPreviewToSide.title%",
          "category": "Markdown",
          "icon": "$(open-preview)"
        },
        {
          "command": "markdown.showSource",
          "title": "%markdown.showSource.title%",
          "category": "Markdown",
          "icon": "$(go-to-file)"
        },
        {
          "command": "markdown.showPreviewSecuritySelector",
          "title": "%markdown.showPreviewSecuritySelector.title%",
          "category": "Markdown"
        },
        {
          "command": "markdown.preview.refresh",
          "title": "%markdown.preview.refresh.title%",
          "category": "Markdown"
        },
        {
          "command": "markdown.preview.toggleLock",
          "title": "%markdown.preview.toggleLock.title%",
          "category": "Markdown"
        }
      ],
      "menus": {
        "editor/title": [
          {
            "command": "markdown.showPreviewToSide",
            "when": "editorLangId == markdown && !notebookEditorFocused",
            "alt": "markdown.showPreview",
            "group": "navigation"
          },
          {
            "command": "markdown.showSource",
            "when": "markdownPreviewFocus",
            "group": "navigation"
          },
          {
            "command": "markdown.preview.refresh",
            "when": "markdownPreviewFocus",
            "group": "1_markdown"
          },
          {
            "command": "markdown.preview.toggleLock",
            "when": "markdownPreviewFocus",
            "group": "1_markdown"
          },
          {
            "command": "markdown.showPreviewSecuritySelector",
            "when": "markdownPreviewFocus",
            "group": "1_markdown"
          }
        ],
        "explorer/context": [
          {
            "command": "markdown.showPreview",
            "when": "resourceLangId == markdown",
            "group": "navigation"
          }
        ],
        "editor/title/context": [
          {
            "command": "markdown.showPreview",
            "when": "resourceLangId == markdown",
            "group": "1_open"
          }
        ],
        "commandPalette": [
          {
            "command": "markdown.showPreview",
            "when": "editorLangId == markdown && !notebookEditorFocused",
            "group": "navigation"
          },
          {
            "command": "markdown.showPreviewToSide",
            "when": "editorLangId == markdown && !notebookEditorFocused",
            "group": "navigation"
          },
          {
            "command": "markdown.showLockedPreviewToSide",
            "when": "editorLangId == markdown && !notebookEditorFocused",
            "group": "navigation"
          },
          {
            "command": "markdown.showSource",
            "when": "markdownPreviewFocus",
            "group": "navigation"
          },
          {
            "command": "markdown.showPreviewSecuritySelector",
            "when": "editorLangId == markdown && !notebookEditorFocused"
          },
          {
            "command": "markdown.showPreviewSecuritySelector",
            "when": "markdownPreviewFocus"
          },
          {
            "command": "markdown.preview.toggleLock",
            "when": "markdownPreviewFocus"
          },
          {
            "command": "markdown.preview.refresh",
            "when": "editorLangId == markdown && !notebookEditorFocused"
          },
          {
            "command": "markdown.preview.refresh",
            "when": "markdownPreviewFocus"
          }
        ]
      },
      "keybindings": [
        {
          "command": "markdown.showPreview",
          "key": "shift+ctrl+v",
          "mac": "shift+cmd+v",
          "when": "editorLangId == markdown && !notebookEditorFocused"
        },
        {
          "command": "markdown.showPreviewToSide",
          "key": "ctrl+k v",
          "mac": "cmd+k v",
          "when": "editorLangId == markdown && !notebookEditorFocused"
        }
      ],
      "configuration": {
        "type": "object",
        "title": "Markdown",
        "order": 20,
        "properties": {
          "markdown.styles": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "default": [],
            "description": "%markdown.styles.dec%",
            "scope": "resource"
          },
          "markdown.preview.breaks": {
            "type": "boolean",
            "default": false,
            "description": "%markdown.preview.breaks.desc%",
            "scope": "resource"
          },
          "markdown.preview.linkify": {
            "type": "boolean",
            "default": true,
            "description": "%markdown.preview.linkify%",
            "scope": "resource"
          },
          "markdown.preview.fontFamily": {
            "type": "string",
            "default": "-apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', 'Droid Sans', sans-serif",
            "description": "%markdown.preview.fontFamily.desc%",
            "scope": "resource"
          },
          "markdown.preview.fontSize": {
            "type": "number",
            "default": 14,
            "description": "%markdown.preview.fontSize.desc%",
            "scope": "resource"
          },
          "markdown.preview.lineHeight": {
            "type": "number",
            "default": 1.6,
            "description": "%markdown.preview.lineHeight.desc%",
            "scope": "resource"
          },
          "markdown.preview.scrollPreviewWithEditor": {
            "type": "boolean",
            "default": true,
            "description": "%markdown.preview.scrollPreviewWithEditor.desc%",
            "scope": "resource"
          },
          "markdown.preview.markEditorSelection": {
            "type": "boolean",
            "default": true,
            "description": "%markdown.preview.markEditorSelection.desc%",
            "scope": "resource"
          },
          "markdown.preview.scrollEditorWithPreview": {
            "type": "boolean",
            "default": true,
            "description": "%markdown.preview.scrollEditorWithPreview.desc%",
            "scope": "resource"
          },
          "markdown.preview.doubleClickToSwitchToEditor": {
            "type": "boolean",
            "default": true,
            "description": "%markdown.preview.doubleClickToSwitchToEditor.desc%",
            "scope": "resource"
          },
          "markdown.preview.openMarkdownLinks": {
            "type": "string",
            "default": "inPreview",
            "description": "%configuration.markdown.preview.openMarkdownLinks.description%",
            "scope": "resource",
            "enum": [
              "inPreview",
              "inEditor"
            ],
            "enumDescriptions": [
              "%configuration.markdown.preview.openMarkdownLinks.inPreview%",
              "%configuration.markdown.preview.openMarkdownLinks.inEditor%"
            ]
          },
          "markdown.links.openLocation": {
            "type": "string",
            "default": "currentGroup",
            "description": "%configuration.markdown.links.openLocation.description%",
            "scope": "resource",
            "enum": [
              "currentGroup",
              "beside"
            ],
            "enumDescriptions": [
              "%configuration.markdown.links.openLocation.currentGroup%",
              "%configuration.markdown.links.openLocation.beside%"
            ]
          },
          "markdown.trace": {
            "type": "string",
            "enum": [
              "off",
              "verbose"
            ],
            "default": "off",
            "description": "%markdown.trace.desc%",
            "scope": "window"
          }
        }
      },
      "configurationDefaults": {
        "[markdown]": {
          "editor.wordWrap": "on",
          "editor.quickSuggestions": false
        }
      },
      "jsonValidation": [
        {
          "fileMatch": "package.json",
          "url": "./schemas/package.schema.json"
        }
      ],
      "markdown.previewStyles": [
        "./media/markdown.css",
        "./media/highlight.css"
      ],
      "markdown.previewScripts": [
        "./media/index.js"
      ],
      "workerMain": "./dist/browser/extension.js"
    },
    "browser": "./dist/browser/extension"
  },
  "defaultPkgNlsJSON": {
    "displayName": "Markdown Language Features",
    "description": "Provides rich language support for Markdown.",
    "markdown.preview.breaks.desc": "Sets how line-breaks are rendered in the markdown preview. Setting it to 'true' creates a <br> for newlines inside paragraphs.",
    "markdown.preview.linkify": "Enable or disable conversion of URL-like text to links in the markdown preview.",
    "markdown.preview.doubleClickToSwitchToEditor.desc": "Double click in the markdown preview to switch to the editor.",
    "markdown.preview.fontFamily.desc": "Controls the font family used in the markdown preview.",
    "markdown.preview.fontSize.desc": "Controls the font size in pixels used in the markdown preview.",
    "markdown.preview.lineHeight.desc": "Controls the line height used in the markdown preview. This number is relative to the font size.",
    "markdown.preview.markEditorSelection.desc": "Mark the current editor selection in the markdown preview.",
    "markdown.preview.scrollEditorWithPreview.desc": "When a markdown preview is scrolled, update the view of the editor.",
    "markdown.preview.scrollPreviewWithEditor.desc": "When a markdown editor is scrolled, update the view of the preview.",
    "markdown.preview.title": "Open Preview",
    "markdown.previewSide.title": "Open Preview to the Side",
    "markdown.showLockedPreviewToSide.title": "Open Locked Preview to the Side",
    "markdown.showSource.title": "Show Source",
    "markdown.styles.dec": "A list of URLs or local paths to CSS style sheets to use from the markdown preview. Relative paths are interpreted relative to the folder open in the explorer. If there is no open folder, they are interpreted relative to the location of the markdown file. All '\\' need to be written as '\\\\'.",
    "markdown.showPreviewSecuritySelector.title": "Change Preview Security Settings",
    "markdown.trace.desc": "Enable debug logging for the markdown extension.",
    "markdown.preview.refresh.title": "Refresh Preview",
    "markdown.preview.toggleLock.title": "Toggle Preview Locking",
    "configuration.markdown.preview.openMarkdownLinks.description": "Controls how links to other markdown files in the markdown preview should be opened.",
    "configuration.markdown.preview.openMarkdownLinks.inEditor": "Try to open links in the editor",
    "configuration.markdown.preview.openMarkdownLinks.inPreview": "Try to open links in the markdown preview",
    "configuration.markdown.links.openLocation.description": "Controls where links in markdown files should be opened.",
    "configuration.markdown.links.openLocation.currentGroup": "Open links in the active editor group.",
    "configuration.markdown.links.openLocation.beside": "Open links beside the active editor."
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json",
    "media/highlight.css",
    "media/index.js",
    "media/markdown.css",
    "media/pre.js",
    "media/preview-dark.svg",
    "media/preview-light.svg",
    "README.md",
    "icon.png",
    "schemas/package.schema.json",
    "dist/browser/extension.js"
  ],
  "mode": "public"
}
