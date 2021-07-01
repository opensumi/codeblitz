import { Autowired, Injectable } from '@ali/common-di';
import { KeybindingRegistry } from '@ali/ide-core-browser';

@Injectable()
export class EditorEmptyService {
  @Autowired(KeybindingRegistry)
  readonly keybindingRegistry: KeybindingRegistry;

  getKeybindingsForCommand(commandId: string) {
    const keybindings = this.keybindingRegistry.getKeybindingsForCommand(commandId);
    if (keybindings.length > 0) {
      const isKeyCombination =
        Array.isArray(keybindings[0].resolved) && keybindings[0].resolved.length > 1;
      let keybinding = this.keybindingRegistry.acceleratorFor(keybindings[0], '+').join(' ');
      if (isKeyCombination) {
        keybinding = `[${keybinding}]`;
      }
      return keybinding;
    }
    return '';
  }
}
