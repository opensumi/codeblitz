import * as os from 'os';

export const EXT_SCHEME = 'kt-ext';

export const ROOT = '/';

export const HOME_ROOT = os.homedir();

export const TMP_ROOT = os.tmpdir();

export const WORKSPACE_ROOT = '/workspace';

export const SCM_ROOT = '/scm';

export const CODE_ROOT = '/code';

export const IDB_ROOT = '/idb';

// 全局数据存储目录
export const STORAGE_DIR = '.cloudide';

export const HOME_IDB_NAME = 'ALEX_HOME';

export const WORKSPACE_IDB_NAME = 'ALEX_WORKSPACE';
