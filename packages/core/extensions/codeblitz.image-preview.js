module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "image-preview",
    "version": "1.53.0-patch.1"
  },
  "packageJSON": {
    "name": "image-preview",
    "publisher": "codeblitz",
    "version": "1.53.0-patch.1",
    "displayName": "%displayName%",
    "description": "%description%",
    "icon": "icon.png",
    "activationEvents": [
      "onCustomEditor:imagePreview.previewEditor",
      "onCommand:imagePreview.zoomIn",
      "onCommand:imagePreview.zoomOut"
    ],
    "kaitianContributes": {
      "workerMain": "./dist/browser/extension.js"
    },
    "contributes": {
      "customEditors": [
        {
          "viewType": "imagePreview.previewEditor",
          "displayName": "%customEditors.displayName%",
          "priority": "builtin",
          "selector": [
            {
              "filenamePattern": "*.{jpg,jpe,jpeg,png,bmp,gif,ico,webp}"
            }
          ]
        }
      ],
      "commands": [
        {
          "command": "imagePreview.zoomIn",
          "title": "%command.zoomIn%",
          "category": "Image Preview"
        },
        {
          "command": "imagePreview.zoomOut",
          "title": "%command.zoomOut%",
          "category": "Image Preview"
        }
      ],
      "menus": {
        "commandPalette": [
          {
            "command": "imagePreview.zoomIn",
            "when": "imagePreviewFocus",
            "group": "1_imagePreview"
          },
          {
            "command": "imagePreview.zoomOut",
            "when": "imagePreviewFocus",
            "group": "1_imagePreview"
          }
        ]
      },
      "workerMain": "./dist/browser/extension.js"
    },
    "browser": "./dist/browser/extension.js"
  },
  "defaultPkgNlsJSON": {
    "displayName": "Image Preview",
    "description": "Provides VS Code's built-in image preview",
    "customEditors.displayName": "Image Preview",
    "command.zoomIn": "Zoom in",
    "command.zoomOut": "Zoom out"
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json",
    "media/main.js",
    "media/main.css",
    "media/loading.svg",
    "media/loading-dark.svg",
    "media/loading-hc.svg",
    "README.md",
    "icon.png",
    "icon.svg",
    "dist/browser/extension.js"
  ],
  "mode": "public"
}
