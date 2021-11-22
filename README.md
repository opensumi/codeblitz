# ALEX (ant light editor extension)
> Ant Codespaces 极速版，无容器环境


## 项目启动
### 准备
需要安装 yarn >= 1.0，使用 yarn 的 [workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) 来管理 packages，tnpm 已配置 mode 为 yarn，因此可以使用 tnpm 安装依赖

### 配置 antcode 私有令牌
在 https://code.alipay.com/profile/private_tokens 找到私有临牌，在根目录新建文件 .env
输入 `PRIVATE_TOKEN=<令牌>`，.env 已被 git 忽略，也可直接通过环境变量配置 PRIVATE_TOKEN

### 启动项目
```bash
1. yarn
2. yarn run init
3. yarn start
```
终端打开输出的地址，默认端口 9009，如被占用，会从 9009 查找可用端口


## 项目研发
### 安装依赖
在根目录安装依赖 yarn 会 warn，需要加 -W 参数，在 packages 安装依赖会自动提升，如果不需要提升，加 --focus

### 增加 package
> 以下方式任选
1. 在 packages 新建文件夹，然后运行 node scripts/bootstrap 会自动为所有无 package.json 的项目初始化
2. 通过命令 npm run create <package> 新建项目

### 开发
#### 升级 kaitian
因为 kaitian 版本升级可能会引起 break change，因为手动升级，运行 `node scripts/upgrade-kaitian.js` 会自动拉去最新版本 kaitian，可以通过 `-v` 指定版本
#### 构建 worker-host 和 webview 资源
每个 kaitian 版本 worker-host 和 webview 可能会变更，需手动构建资源并发布到 cdn，cdn 地址由 git 管理并随 npm 包一起发布，每次发布前会检查当前 kaitian 版本资源是否已发布

需要在 .env 配置 ak，从 https://yuyan.antfin-inc.com/cloud-ide/services/accesskey 获取 alex-app 的 ak
#### 构建
```bash
# 构建所有 packages
# --scope 指定包
# --watch 监听模式
npm run build
# bundle 成 umd 文件
node scripts/bundle
```

### 发布版本
```bash
# 交互式选择版本发布，并更改 package.json 和 git push
# 请确保有 tnpm 发包权限和仓库 master 权限
node scripts/release
```
