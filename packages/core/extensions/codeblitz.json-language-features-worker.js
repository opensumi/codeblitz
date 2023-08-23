module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "json-language-features-worker",
    "version": "1.53.0-patch.1"
  },
  "packageJSON": {
    "name": "json-language-features-worker",
    "publisher": "alex",
    "version": "1.53.0-patch.1",
    "displayName": "%displayName%",
    "description": "%description%",
    "icon": "icons/json.png",
    "activationEvents": [
      "onLanguage:json",
      "onLanguage:jsonc"
    ],
    "contributes": {
      "configuration": {
        "id": "json",
        "order": 20,
        "type": "object",
        "title": "JSON",
        "properties": {
          "json.schemas": {
            "type": "array",
            "scope": "resource",
            "description": "%json.schemas.desc%",
            "items": {
              "type": "object",
              "default": {
                "fileMatch": [
                  "/myfile"
                ],
                "url": "schemaURL"
              },
              "properties": {
                "url": {
                  "type": "string",
                  "default": "/user.schema.json",
                  "description": "%json.schemas.url.desc%"
                },
                "fileMatch": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "default": "MyFile.json",
                    "description": "%json.schemas.fileMatch.item.desc%"
                  },
                  "minItems": 1,
                  "description": "%json.schemas.fileMatch.desc%"
                },
                "schema": {
                  "$ref": "http://json-schema.org/draft-07/schema#",
                  "description": "%json.schemas.schema.desc%"
                }
              }
            }
          },
          "json.format.enable": {
            "type": "boolean",
            "scope": "window",
            "default": true,
            "description": "%json.format.enable.desc%"
          },
          "json.trace.server": {
            "type": "string",
            "scope": "window",
            "enum": [
              "off",
              "messages",
              "verbose"
            ],
            "default": "off",
            "description": "%json.tracing.desc%"
          },
          "json.colorDecorators.enable": {
            "type": "boolean",
            "scope": "window",
            "default": true,
            "description": "%json.colorDecorators.enable.desc%",
            "deprecationMessage": "%json.colorDecorators.enable.deprecationMessage%"
          },
          "json.maxItemsComputed": {
            "type": "number",
            "default": 5000,
            "description": "%json.maxItemsComputed.desc%"
          },
          "json.schemaDownload.enable": {
            "type": "boolean",
            "default": true,
            "description": "%json.enableSchemaDownload.desc%",
            "tags": [
              "usesOnlineServices"
            ]
          }
        }
      },
      "configurationDefaults": {
        "[json]": {
          "editor.quickSuggestions": {
            "strings": true
          },
          "editor.suggest.insertMode": "replace"
        },
        "[jsonc]": {
          "editor.quickSuggestions": {
            "strings": true
          },
          "editor.suggest.insertMode": "replace"
        }
      },
      "jsonValidation": [
        {
          "fileMatch": "*.schema.json",
          "url": "http://json-schema.org/draft-07/schema#"
        }
      ]
    },
    "browser": "./client/dist/browser/jsonClientMain"
  },
  "defaultPkgNlsJSON": {
    "displayName": "JSON Language Features",
    "description": "Provides rich language support for JSON files.",
    "json.schemas.desc": "Associate schemas to JSON files in the current project",
    "json.schemas.url.desc": "A URL to a schema or a relative path to a schema in the current directory",
    "json.schemas.fileMatch.desc": "An array of file patterns to match against when resolving JSON files to schemas. `*` can be used as a wildcard. Exclusion patterns can also be defined and start with '!'. A file matches when there is at least one matching pattern and the last matching pattern is not an exclusion pattern.",
    "json.schemas.fileMatch.item.desc": "A file pattern that can contain '*' to match against when resolving JSON files to schemas.",
    "json.schemas.schema.desc": "The schema definition for the given URL. The schema only needs to be provided to avoid accesses to the schema URL.",
    "json.format.enable.desc": "Enable/disable default JSON formatter",
    "json.tracing.desc": "Traces the communication between VS Code and the JSON language server.",
    "json.colorDecorators.enable.desc": "Enables or disables color decorators",
    "json.colorDecorators.enable.deprecationMessage": "The setting `json.colorDecorators.enable` has been deprecated in favor of `editor.colorDecorators`.",
    "json.schemaResolutionErrorMessage": "Unable to resolve schema.",
    "json.clickToRetry": "Click to retry.",
    "json.maxItemsComputed.desc": "The maximum number of outline symbols and folding regions computed (limited for performance reasons).",
    "json.maxItemsExceededInformation.desc": "Show notification when exceeding the maximum number of outline symbols and folding regions.",
    "json.enableSchemaDownload.desc": "When enabled, JSON schemas can be fetched from http and https locations."
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json",
    "server/dist/browser/jsonServerMain.js",
    "README.md",
    "icons/json.png",
    "http://json-schema.org/draft-07/schema#",
    "client/dist/browser/jsonClientMain.js"
  ],
  "mode": "public"
}
