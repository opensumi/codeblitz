import { Injectable } from '@ali/common-di';
import {
  IStatusBarService,
  StatusBarEntry,
  StatusBarEntryAccessor,
} from '@ali/ide-core-browser/lib/services';

@Injectable()
export class EmptyStatusBarService implements IStatusBarService {
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
