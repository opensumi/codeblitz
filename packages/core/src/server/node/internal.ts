/**
 * 集中导出并被其它模块使用，避免循环引用
 */

import { BFSRequire, install } from 'browserfs';
import assert from 'assert';

export const fs = BFSRequire('fs');

export const path = BFSRequire('path');

export const buffer = BFSRequire('buffer');

const { Buffer } = buffer;

export const process = BFSRequire('process');

import * as os from './os';

export { assert, os, Buffer };

install(window);
