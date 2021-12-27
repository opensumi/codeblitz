import { DependencyList, useEffect, useState, useMemo } from 'react';
import { useEventEmitter, usePrevious } from 'ahooks';
import sha1 from 'sha1';
import differenceBy from 'lodash/differenceBy';
import { IExtensionMetadata } from '@alipay/alex-shared';

import { Diff, DiffOverview } from './antcode/types/diff';
import { FileReadMark } from './antcode/types/file-read-mark';

interface Options<T> {
  deps?: DependencyList;
  initial?: T;
  ready?: boolean;
}

export function useRequest<T>(
  factory: () => Promise<T> | undefined | null,
  options?: Options<T>
): T {
  const { deps = [], initial, ready = true } = options || {};
  const [val, setVal] = useState<T>(initial!);
  useEffect(() => {
    if (!ready) return;
    let cancel = false;
    const promise = factory();
    if (promise === undefined || promise === null) return;
    promise
      .then((val) => {
        if (!cancel) {
          setVal(val);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      cancel = true;
    };
  }, [...deps, ready]);
  return val;
}

export function useFileReadMarkChange$(diffs: Diff[] | DiffOverview[], readMarks: FileReadMark[]) {
  const fileReadMarkChange$ = useEventEmitter<string>();
  const filePathShaMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const diff of diffs) {
      map.set(sha1(diff.newPath), diff.newPath);
    }
    return map;
  }, [diffs]);

  const prevReadMarks = usePrevious(readMarks);
  useEffect(() => {
    const changesA = differenceBy(prevReadMarks, readMarks, (readMark) => readMark.filePathSha);
    const changesB = differenceBy(readMarks, prevReadMarks!, (readMark) => readMark.filePathSha);
    for (const change of [...changesA, ...changesB]) {
      const filePath = filePathShaMap.get(change.filePathSha);
      if (filePath) {
        fileReadMarkChange$.emit(filePath);
      }
    }
  }, [readMarks, filePathShaMap]);

  return fileReadMarkChange$;
}
