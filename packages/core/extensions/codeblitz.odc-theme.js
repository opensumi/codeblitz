module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "odc-theme",
    "version": "1.0.2"
  },
  "packageJSON": {
    "name": "odc-theme",
    "publisher": "codeblitz",
    "version": "1.0.2",
    "displayName": "ODC UI Theme",
    "description": "ODC UI Theme",
    "icon": "icons/icon.png",
    "contributes": {
      "themes": [
        {
          "id": "odc-light",
          "label": "ODC Light",
          "uiTheme": "vs",
          "path": "./themes/light/plus.json"
        }
      ]
    }
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [
    "package.json",
    "themes/light/plus.json",
    "themes/light/vs.json",
    "themes/light/defaults.json"
  ],
  "mode": "public"
}
