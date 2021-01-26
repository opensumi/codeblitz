# SpaceX
> Ant Codespaces 纯前端版本临时代号


## 项目启动
### 准备
需要安装 yarn >= 1.0，使用 yarn 的 [workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) 来管理 packages，tnpm 已配置 mode 为 yarn，因此可以使用 tnpm 安装依赖

### 配置 antcode 私有令牌
在 https://code.alipay.com/profile/private_tokens 找到私有临牌，在根目录新建文件 .env
输入 `PRIVATE_TOKEN=<令牌>`，.env 已自动被 git 忽略，也可直接通过环境变量配置 PRIVATE_TOKEN

### 启动项目
```bash
1. yarn
2. npm run init
3. npm start
```

## 项目研发
### 安装依赖
在根目录安装依赖 yarn 会 warn，需要加 -W 参数，在 packages 安装依赖会自动提升，如果不需要提升，加 --focus

### 增加 package
> 以下方式任选
1. 在 packages 新建文件夹，然后运行 node scripts/bootstrap 会自动为所有无 package.json 的项目初始化
2. 通过命令 npm run create <package> 新建项目

### 构建打包
```sh
# 构建所有 packages
npm run build
# 单独构建 package
npm run build -- --scope <package>
# 单独构建并监听
npm run build -- --scope <package> --watch
# 构建 worker 和 webview 资源并发布 cdn
node scripts/build-assets
# bundle 成 umd 文件
node scripts/bundle
# 发布，此步骤会自动构建打包，运行测试等，可通过 --no 跳过一些步骤
node scripts/release
```
