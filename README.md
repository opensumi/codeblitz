# SpaceX
> Ant Codespaces 纯前端版本临时代号


## 项目研发
### 准备
需要安装 yarn >= 1.0，使用 yarn 的 [workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) 来管理 packages，tnpm 已配置 mode 为 yarn，因此可以使用 tnpm 安装依赖

### 安装依赖
在根目录安装依赖 yarn 会 warn，需要加 -W 参数，在 packages 安装依赖会自动提升，如果不需要提升，加 --focus

### 安装 worker 扩展
```bash
npm run ext
```

### 增加 package
1. 在 packages 新建文件夹，然后运行 node scripts/bootstrap 会自动为所有无 package.json 的项目初始化
2. 通过命令 npm run create <package> 新建项目

### 构建
```sh
# 构建所有 packages
npm run build
# 单独构建 package
npm run build -- --scope <package>
# 单独构建并监听
npm run build -- --scope <package> --watch
# 运行 app 集成版本
npm start app
```
