# Code Runner for Web

[![Actions Status](https://github.com/formulahendry/vscode-code-runner-for-web/actions/workflows/main.yml/badge.svg)](https://github.com/formulahendry/vscode-code-runner-for-web/actions/workflows/main.yml)

Run code in browser: Python

## Usages

* To run code:
  * open **Command Palette** (<kbd>Ctrl+Shift+P</kbd>), then type `Run Code in Web`, 
  * or right click the Text Editor and then click `Run Code in Web` in editor context menu
  * or click `Run Code  in Web` button in editor title menu

![usage](https://github.com/formulahendry/vscode-code-runner-for-web/raw/HEAD/images/usage.png)

## Limitation

* Only support [Python standard library](https://docs.python.org/3/library/) and [prebuilt Python packages in Pyodide](https://pyodide.org/en/latest/usage/packages-in-pyodide.html)
* Only support running single Python file

## Telemetry

Anonymous telemetry collection is on by default. To opt out, please set the `telemetry.enableTelemetry` setting to `false`. Learn more in [FAQ](https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting).