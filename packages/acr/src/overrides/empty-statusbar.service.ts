import { Injectable, IDisposable } from '@opensumi/di';
import {
  IStatusBarService,
  StatusBarEntry,
  StatusBarEntryAccessor,
} from '@opensumi/ide-core-browser/lib/services';
import {
  IMenu,
  IMenuNodeOptions,
  MenuItemNode,
  SubmenuItemNode,
  ComponentMenuItemNode,
} from '@opensumi/ide-core-browser/lib/menu/next';

@Injectable()
export class EmptyStatusBarService implements IStatusBarService {
  contextMenu: IMenu = {
    menuId: '',
    onDidChange: function (
      listener: (e: IMenu | undefined) => any,
      thisArgs?: any,
      disposables?: IDisposable[]
    ): IDisposable {
      if (process.env.NODE_ENV !== 'production') {
        console.log('empty Method not implemented.');
      }
      return {
        dispose: this.dispose,
      };
    },
    getMenuNodes: function (
      options?: IMenuNodeOptions
    ): [string, (MenuItemNode | SubmenuItemNode | ComponentMenuItemNode)[]][] {
      if (process.env.NODE_ENV !== 'production') {
        console.log('empty Method not implemented.');
      }
      return [];
    },
    onDispose: function (
      listener: (e: void) => any,
      thisArgs?: any,
      disposables?: IDisposable[]
    ): IDisposable {
      if (process.env.NODE_ENV !== 'production') {
        console.log('empty Method not implemented.');
      }
      return {
        dispose: this.dispose,
      };
    },
    dispose: function (): void {
      return;
    },
  };
  toggleElement(entryId: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log('empty Method not implemented.');
    }
  }
  getBackgroundColor(): string {
    if (process.env.NODE_ENV !== 'production') {
      console.log('empty Method not implemented.');
    }
    return '';
  }
  setBackgroundColor(color?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log('empty Method not implemented.');
    }
  }
  setColor(color?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log('empty Method not implemented.');
    }
  }
  addElement(id: string, entry: StatusBarEntry): StatusBarEntryAccessor {
    if (process.env.NODE_ENV !== 'production') {
      console.log('empty Method not implemented.');
    }
    return {
      dispose() {},
      update() {},
    };
  }
  setElement(id: string, fields: any): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log('empty Method not implemented.');
    }
  }
  removeElement(id: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log('empty Method not implemented.');
    }
  }
  leftEntries: StatusBarEntry[] = [];
  rightEntries: StatusBarEntry[] = [];
}
