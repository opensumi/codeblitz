# 发布 CodeBlitz

## 更新 OpenSumi 版本

提供了一个脚本一键更新 OpenSumi 版本：

```sh
node scripts/upgrade-opensumi.js -v x.x.x
```

在 codeblitz 项目根目录执行这个命令即可。

然后所有包的 OpenSumi 版本都会被更新为指定版本，将这些更新都提交了即可。

## 发布

发布流程和 OpenSumi 一样，参考这个 Wiki 即可：https://github.com/opensumi/core/wiki/%E5%8F%91%E5%B8%83%E6%96%87%E6%A1%A3

对应的 action 地址在这里：<https://github.com/opensumi/codeblitz/actions/workflows/release.yml>
