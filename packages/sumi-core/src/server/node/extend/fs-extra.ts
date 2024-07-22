import assert from 'assert';
import buffer from 'buffer';
import fsExtraFactory from 'fs-extra-factory';
import path from 'path';

import { fs } from '../bfs';

export const fsExtra = fsExtraFactory({
  fs,
  path,
  process,
  assert,
  buffer,
});
