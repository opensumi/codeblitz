# alipay code review component

## Development

### 本地研发

```bash
npm run start
```

绑定 host

```
127.0.0.1		code.test.alipay.net
```

打开 http://code.test.alipay.net:7017

### 交付与验证

1. 部署到 antcode 测试环境，由开发自行验证各自开发功能
2. 部署到 antcode 预发环境，由产品侧验证交付功能

## 分支管理

- 特性研发请基于 features 分支实现并合并到 features 分支 (合并前置条件是对应需求的 owner(多为 pd) 完成了特性验证)
- fix 等请基于 master 进行研发实现并合并到 master 分支
- 特殊情况下，可能特性分支 features 上有 bugfix 但是 master 尚未合并 features 分支，此类 fix 请向 features 分支提 pr 即可
- features 分支会在合并到 master 之前，先去 merge master 分支，如没有权限可以联系 伊北 操作

## 目录结构

> 待更新

```
.
├── README.md
├── modules
│   ├── common-commands // 移植一些通用的 vscode namespace 命令
│   ├── file-provider // fs provider browser 层实现
│   ├── git-scheme // git scheme 相关实现
│   ├── kt-ext-provider // kt-ext scheme 相关实现，为纯前端版本的插件协议
│   ├── language-service // lsif/lsp
│   │   └── index.contribution.ts
│   ├── sample.contribution.ts
│   ├── scm-provider
│   │   └── index.contribution.tsx
│   ├── textmate-language-grammar // 批量注册 language/grammar
│   └── view // 视图层相关注册
├── extensions // 插件相关
│   ├── index.ts
├── service // 一些通用模块实现
│   ├── code-service // 中心化代码服务
│   ├── language-service // 简化版本的语言服务实现
│   ├── lsif-service // 中心化 lsif 服务
│   └── meta-service // 目前用来放 meta 信息，后续应升级为 IApplicationService
├── overrides // 一些纯前端版本的覆盖
│   ├── browser-file-scheme.ts // 覆盖 file-scheme 模块
│   ├── doc-client.ts
│   └── mock-logger.ts // 覆盖 logger
├── utils 放一些公共的 util
└── web-lite-module.ts // 总的入口
```

## 一些备注

### toggle 高亮功能

- 基于只有 M 的才会打开变更视图，因此在本组件中的 diff 左右侧 uri 都是相同文件名，从而推断是同一个文件后缀名，因此只要有一侧高亮了，那么就都是高亮的

### 生存模式

通过 url 上增加 query `__ide_mode=debug` 开启：

- scm 处可以下载变更文件内容

### 通过 url params 指定 pr 打开

例子如下，传入 projectId/projectPath/prIid 即可

```js
  // ?projectId=42422&projectPath=ide-s%2FTypeScript-Node-Starter&prIid=2
```

**说明**
* projectId 为 antcode 侧的项目的 id
* projectPath 中间的 `/` 转义为 `%2F`
* prIid 为 antcode 侧单个项目中 pr 的自增序号 (网页 url 中可找到)

#### Special Repos

##### 该 pr 中有离线索引
* http://code.test.alipay.net/yizhu.x/redcoast/pull_requests/36
* http://code.test.alipay.net:9009/?projectId=39558&projectPath=yizhu.x%2Fredcoast&prIid=36

##### 该 pr 中 path 带有 constructor 关键字
* http://code.test.alipay.net:9009/?projectId=600133&projectPath=taian.lta%2Figlobalfundcontrol&prIid=1
