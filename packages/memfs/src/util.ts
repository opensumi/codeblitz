import { FileIndex } from '@alipay/alex-core';

interface WalkEvent {
  (params: { type: 'file'; path: string; content: string }): void;
  (params: { type: 'dir'; path: string; content: FileIndex }): void;
}

export const walkFileIndex = (fileIndex: FileIndex, cb: WalkEvent) => {
  const queue: [string, FileIndex][] = [['', fileIndex]];
  while (queue.length > 0) {
    const next = queue.pop();
    const pwd = next![0];
    const tree = next![1];
    for (const node in tree) {
      if (tree.hasOwnProperty(node)) {
        const children = tree[node];
        const path = `${pwd}/${node}`;
        if (typeof children === 'string') {
          cb({ type: 'file', path, content: children });
        } else {
          cb({ type: 'dir', path, content: children });
          queue.push([path, children]);
        }
      }
    }
  }
};
