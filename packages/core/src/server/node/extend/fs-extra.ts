import fsExtraFactory from 'fs-extra-factory';
import { fs, path, process, assert, buffer } from '../internal';

const fse = fsExtraFactory({
  fs,
  path,
  process,
  assert,
  buffer,
});

export default fse;
