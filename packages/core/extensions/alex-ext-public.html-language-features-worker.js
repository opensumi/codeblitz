module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "html-language-features-worker",
    "version": "1.53.0-patch.1"
  },
  "packageJSON": {
    "name": "html-language-features-worker",
    "publisher": "alex",
    "version": "1.53.0-patch.1",
    "displayName": "%displayName%",
    "description": "%description%",
    "icon": "icons/html.png",
    "activationEvents": [
      "onLanguage:html",
      "onLanguage:handlebars"
    ],
    "contributes": {
      "configuration": {
        "id": "html",
        "order": 20,
        "type": "object",
        "title": "HTML",
        "properties": {
          "html.customData": {
            "type": "array",
            "markdownDescription": "%html.customData.desc%",
            "default": [],
            "items": {
              "type": "string"
            },
            "scope": "resource"
          },
          "html.format.enable": {
            "type": "boolean",
            "scope": "window",
            "default": true,
            "description": "%html.format.enable.desc%"
          },
          "html.format.wrapLineLength": {
            "type": "integer",
            "scope": "resource",
            "default": 120,
            "description": "%html.format.wrapLineLength.desc%"
          },
          "html.format.unformatted": {
            "type": [
              "string",
              "null"
            ],
            "scope": "resource",
            "default": "wbr",
            "markdownDescription": "%html.format.unformatted.desc%"
          },
          "html.format.contentUnformatted": {
            "type": [
              "string",
              "null"
            ],
            "scope": "resource",
            "default": "pre,code,textarea",
            "markdownDescription": "%html.format.contentUnformatted.desc%"
          },
          "html.format.indentInnerHtml": {
            "type": "boolean",
            "scope": "resource",
            "default": false,
            "markdownDescription": "%html.format.indentInnerHtml.desc%"
          },
          "html.format.preserveNewLines": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%html.format.preserveNewLines.desc%"
          },
          "html.format.maxPreserveNewLines": {
            "type": [
              "number",
              "null"
            ],
            "scope": "resource",
            "default": null,
            "markdownDescription": "%html.format.maxPreserveNewLines.desc%"
          },
          "html.format.indentHandlebars": {
            "type": "boolean",
            "scope": "resource",
            "default": false,
            "markdownDescription": "%html.format.indentHandlebars.desc%"
          },
          "html.format.endWithNewline": {
            "type": "boolean",
            "scope": "resource",
            "default": false,
            "description": "%html.format.endWithNewline.desc%"
          },
          "html.format.extraLiners": {
            "type": [
              "string",
              "null"
            ],
            "scope": "resource",
            "default": "head, body, /html",
            "markdownDescription": "%html.format.extraLiners.desc%"
          },
          "html.format.wrapAttributes": {
            "type": "string",
            "scope": "resource",
            "default": "auto",
            "enum": [
              "auto",
              "force",
              "force-aligned",
              "force-expand-multiline",
              "aligned-multiple",
              "preserve",
              "preserve-aligned"
            ],
            "enumDescriptions": [
              "%html.format.wrapAttributes.auto%",
              "%html.format.wrapAttributes.force%",
              "%html.format.wrapAttributes.forcealign%",
              "%html.format.wrapAttributes.forcemultiline%",
              "%html.format.wrapAttributes.alignedmultiple%",
              "%html.format.wrapAttributes.preserve%",
              "%html.format.wrapAttributes.preservealigned%"
            ],
            "description": "%html.format.wrapAttributes.desc%"
          },
          "html.format.wrapAttributesIndentSize": {
            "type": [
              "number",
              "null"
            ],
            "scope": "resource",
            "default": null,
            "description": "%html.format.wrapAttributesIndentSize.desc%"
          },
          "html.format.templating": {
            "type": [
              "boolean"
            ],
            "scope": "resource",
            "default": false,
            "description": "%html.format.templating.desc%"
          },
          "html.format.unformattedContentDelimiter": {
            "type": [
              "string"
            ],
            "scope": "resource",
            "default": "",
            "markdownDescription": "%html.format.unformattedContentDelimiter.desc%"
          },
          "html.suggest.html5": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%html.suggest.html5.desc%"
          },
          "html.validate.scripts": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%html.validate.scripts%"
          },
          "html.validate.styles": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%html.validate.styles%"
          },
          "html.autoClosingTags": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%html.autoClosingTags%"
          },
          "html.hover.documentation": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%html.hover.documentation%"
          },
          "html.hover.references": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%html.hover.references%"
          },
          "html.mirrorCursorOnMatchingTag": {
            "type": "boolean",
            "scope": "resource",
            "default": false,
            "description": "%html.mirrorCursorOnMatchingTag%",
            "deprecationMessage": "%html.mirrorCursorOnMatchingTagDeprecationMessage%"
          },
          "html.trace.server": {
            "type": "string",
            "scope": "window",
            "enum": [
              "off",
              "messages",
              "verbose"
            ],
            "default": "off",
            "description": "%html.trace.server.desc%"
          }
        }
      },
      "configurationDefaults": {
        "[html]": {
          "editor.suggest.insertMode": "replace"
        },
        "[handlebars]": {
          "editor.suggest.insertMode": "replace"
        }
      },
      "jsonValidation": [
        {
          "fileMatch": "*.html-data.json",
          "url": "https://raw.githubusercontent.com/microsoft/vscode-html-languageservice/master/docs/customData.schema.json"
        },
        {
          "fileMatch": "package.json",
          "url": "./schemas/package.schema.json"
        }
      ]
    },
    "browser": "./client/dist/browser/htmlClientMain"
  },
  "defaultPkgNlsJSON": {
    "displayName": "HTML Language Features",
    "description": "Provides rich language support for HTML and Handlebar files",
    "html.customData.desc": "A list of relative file paths pointing to JSON files following the [custom data format](https://github.com/microsoft/vscode-html-languageservice/blob/master/docs/customData.md).\n\nVS Code loads custom data on startup to enhance its HTML support for the custom HTML tags, attributes and attribute values you specify in the JSON files.\n\nThe file paths are relative to workspace and only workspace folder settings are considered.",
    "html.format.enable.desc": "Enable/disable default HTML formatter.",
    "html.format.wrapLineLength.desc": "Maximum amount of characters per line (0 = disable).",
    "html.format.unformatted.desc": "List of tags, comma separated, that shouldn't be reformatted. `null` defaults to all tags listed at https://www.w3.org/TR/html5/dom.html#phrasing-content.",
    "html.format.contentUnformatted.desc": "List of tags, comma separated, where the content shouldn't be reformatted. `null` defaults to the `pre` tag.",
    "html.format.indentInnerHtml.desc": "Indent `<head>` and `<body>` sections.",
    "html.format.preserveNewLines.desc": "Controls whether existing line breaks before elements should be preserved. Only works before elements, not inside tags or for text.",
    "html.format.maxPreserveNewLines.desc": "Maximum number of line breaks to be preserved in one chunk. Use `null` for unlimited.",
    "html.format.indentHandlebars.desc": "Format and indent `{{#foo}}` and `{{/foo}}`.",
    "html.format.endWithNewline.desc": "End with a newline.",
    "html.format.extraLiners.desc": "List of tags, comma separated, that should have an extra newline before them. `null` defaults to `\"head, body, /html\"`.",
    "html.format.wrapAttributes.desc": "Wrap attributes.",
    "html.format.wrapAttributes.auto": "Wrap attributes only when line length is exceeded.",
    "html.format.wrapAttributes.force": "Wrap each attribute except first.",
    "html.format.wrapAttributes.forcealign": "Wrap each attribute except first and keep aligned.",
    "html.format.wrapAttributes.forcemultiline": "Wrap each attribute.",
    "html.format.wrapAttributes.alignedmultiple": "Wrap when line length is exceeded, align attributes vertically.",
    "html.format.wrapAttributes.preserve": "Preserve wrapping of attributes",
    "html.format.wrapAttributes.preservealigned": "Preserve wrapping of attributes but align.",
    "html.format.templating.desc": "Honor django, erb, handlebars and php templating language tags.",
    "html.format.unformattedContentDelimiter.desc": "Keep text content together between this string.",
    "html.format.wrapAttributesIndentSize.desc": "Alignment size when using 'force aligned' and 'aligned multiple' in `#html.format.wrapAttributes#` or `null` to use the default indent size.",
    "html.suggest.html5.desc": "Controls whether the built-in HTML language support suggests HTML5 tags, properties and values.",
    "html.trace.server.desc": "Traces the communication between VS Code and the HTML language server.",
    "html.validate.scripts": "Controls whether the built-in HTML language support validates embedded scripts.",
    "html.validate.styles": "Controls whether the built-in HTML language support validates embedded styles.",
    "html.autoClosingTags": "Enable/disable autoclosing of HTML tags.",
    "html.mirrorCursorOnMatchingTag": "Enable/disable mirroring cursor on matching HTML tag.",
    "html.mirrorCursorOnMatchingTagDeprecationMessage": "Deprecated in favor of `editor.linkedEditing`",
    "html.hover.documentation": "Show tag and attribute documentation in hover.",
    "html.hover.references": "Show references to MDN in hover."
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json",
    "server/dist/browser/htmlServerMain.js",
    "README.md",
    "icons/html.png",
    "https://raw.githubusercontent.com/microsoft/vscode-html-languageservice/master/docs/customData.schema.json",
    "schemas/package.schema.json",
    "client/dist/browser/htmlClientMain.js"
  ],
  "mode": "public"
}
