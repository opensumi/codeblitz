import fsExtraFactory from 'fs-extra-factory';
import assert from 'assert';
import buffer from 'buffer';
import path from 'path';

import { fs } from '../bfs';

const fse = fsExtraFactory({
  fs,
  path,
  process,
  assert,
  buffer,
});

export default fse;
