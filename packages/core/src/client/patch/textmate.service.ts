// @ts-nocheck

import { TextmateService } from '@ali/ide-monaco/lib/browser/textmate.service';
import { IOnigLib } from 'vscode-textmate';
import { OnigScanner, OnigString } from 'vscode-oniguruma';

let onigLoaded = false;

class OnigasmLib implements IOnigLib {
  createOnigScanner(source: string[]) {
    return new OnigScanner(source);
  }
  createOnigString(source: string) {
    return new OnigString(source);
  }
}

export class TextmateServicePatch extends TextmateService {
  getOnigLib() {
    if (onigLoaded) {
      return new OnigasmLib();
    }
    onigLoaded = true;
    return super.getOnigLib();
  }
}
