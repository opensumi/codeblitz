import { Emitter } from '@ali/ide-core-browser';

const fileReadMap = new Map<string, boolean>();

const fileReadEmitter = new Emitter<string>();

export const read = {
  markFileAsRead: (filePath: string) => {
    fileReadMap.set(filePath, true);
    fileReadEmitter.fire(filePath);
    return Promise.resolve({ markAsRead: true, updatedAfterRead: false });
  },
  markFileAsUnread: (filePath: string) => {
    fileReadMap.set(filePath, false);
    fileReadEmitter.fire(filePath);
    return Promise.resolve({ markAsRead: false, updatedAfterRead: false });
  },
  getFileReadStatus: (filePath: string) => !!fileReadMap.get(filePath),
  fileReadMarkChange$: {
    useSubscription: fileReadEmitter.event,
  },
};
