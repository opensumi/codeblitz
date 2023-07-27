import type {
  ICodePlatform,
  RefsParam,
  EntryInfo,
  EntryParam,
  TreeEntry,
  IRepositoryModel,
  EntryFileType,
  ICodeAPIService,
} from '@codeblitzjs/ide-code-api';

export type {
  ICodePlatform,
  RefsParam,
  EntryInfo,
  EntryParam,
  TreeEntry,
  EntryFileType,
  IRepositoryModel,
};

export { CodePlatform } from '@codeblitzjs/ide-code-api';

export const ICodeServiceConfig = Symbol('ICodeServiceConfig');

export type ICodeServiceConfig = {
  /** 平台 */
  platform: ICodePlatform;
  /** 群组或用户 */
  owner: string;
  /** 仓库名 */
  name: string;
  /** 从代码托管平台跳转过来的路径，解析出 ref 和默认打开的文件，如 blob/master/README.md  */
  refPath?: string;
  /** ref */
  ref?: string;
  /** tag */
  tag?: string;
  /** branch */
  branch?: string;
  /** commit sha */
  commit?: string;
  /** url hash */
  hash?: string;
} & {
  /** submodules 多平台配置 */
  [key in ICodePlatform]?: {
    hostname?: string[];
    /** location.origin */
    origin?: string;
    /** 用于接口请求，不设置为 origin */
    endpoint?: string;
    /** api 请求 token，上层可预设 token */
    token?: string;
  };
};

export type InitializeState =
  | 'Uninitialized'
  | 'Failed' // 初始化失败
  | 'Initialized'; // HEAD 初始化，此时可基于 commit 获取数据

/**
 * 无需 Remote
 */
export const enum RefType {
  Head,
  Tag,
}

export interface Ref {
  readonly type: RefType;
  readonly name: string;
  readonly commit: string;
}

export interface HeadRef {
  readonly type: RefType;
  readonly name?: string;
  readonly commit?: string;
}

export interface Refs {
  readonly branches: Ref[];
  readonly tags: Ref[];
}

export interface Submodule {
  name: string;
  path: string;
  url: string;
}

export interface ProjectDesc {
  platform: ICodePlatform;
  owner: string;
  name: string;
}

type Tail<T extends any[]> = T extends [IRepositoryModel, ...infer P] ? P : T;

type Carry<F> = F extends (...args: any[]) => any
  ? (...args: Tail<Parameters<F>>) => ReturnType<F>
  : F;

export type ICodeAPIProxy = {
  [P in keyof ICodeAPIService]: Carry<ICodeAPIService[P]>;
};
