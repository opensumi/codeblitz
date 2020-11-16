/**
 * 集中导出并被其它模块使用，避免循环引用
 */

import { BFSRequire, configure } from 'browserfs'
import assert from 'assert'

export const fs = BFSRequire('fs')

export const path = BFSRequire('path')

export const buffer = BFSRequire('buffer')

export const process = BFSRequire('process')

import * as os from './os'

export { assert, os }
