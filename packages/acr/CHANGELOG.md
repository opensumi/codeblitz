# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.9.4](https://code.alipay.com/cloud-ide/acr-ide/compare/v1.9.3...v1.9.4) (2021-02-19)


### Bug Fixes

* 修复重命名文件同时存在变更的情况 ([6d920eb](https://code.alipay.com/cloud-ide/acr-ide/commit/6d920ebbe017bc43bad19e29dbfb54f34d1afe74))
* 暂时去掉根据 binary_file 判断是否是二进制文件 ([6323acd](https://code.alipay.com/cloud-ide/acr-ide/commit/6323acd5fd202bf66395c1f2fbd7284d8fed7ab1))

### [1.9.3](https://code.alipay.com/cloud-ide/acr-ide/compare/v1.9.3-beta.0...v1.9.3) (2021-02-19)


### Bug Fixes

* vscode-languageserver-protocol import ([b6d361c](https://code.alipay.com/cloud-ide/acr-ide/commit/b6d361c5c4fbfc0e53cfa25ef09285a5c857b68e))

### [1.9.3-beta.0](https://code.alipay.com/cloud-ide/acr-ide/compare/v1.9.2...v1.9.3-beta.0) (2021-02-19)


### Bug Fixes

* use performance.now instead of Date.now ([eb5f84b](https://code.alipay.com/cloud-ide/acr-ide/commit/eb5f84b47841eed6f91d63fe29f6b63f082a2ced))
* 修复 web-scm 会出现上一文件的折叠状态问题 ([0902c1d](https://code.alipay.com/cloud-ide/acr-ide/commit/0902c1d08f8908f15afed0887c4c2e7576b45d31))
* 修复二进制文件展示问题 ([d9231c4](https://code.alipay.com/cloud-ide/acr-ide/commit/d9231c4f4083ff9867d22677e19ac25833b2e571))
* 修复开启折叠后不会自动展示评论的问题 ([bf89cef](https://code.alipay.com/cloud-ide/acr-ide/commit/bf89cef656df77b2ebe0d3305ef8298b28207f72))
* 修复开启折叠后不会自动展示评论的问题 ([2ab238c](https://code.alipay.com/cloud-ide/acr-ide/commit/2ab238c48eadb0deb92d1a6a88f79041d728ac20))
* 增加 change 容错 ([bccf3fb](https://code.alipay.com/cloud-ide/acr-ide/commit/bccf3fb3fc3a6deb4d19b761ea08d8b4aaff46af))
* 如果只是重命名而没有修改内容，则直接使用 git 协议打开 ([bcc9d82](https://code.alipay.com/cloud-ide/acr-ide/commit/bcc9d82f92ad816c21de6904cfd4a01fb27bcb6a))

### [1.9.2](https://code.alipay.com/cloud-ide/acr-ide/compare/v1.9.1...v1.9.2) (2021-01-26)


### Bug Fixes

* 开启忽略空白符并针对 editor/title 操作区进行排序 ([0554835](https://code.alipay.com/cloud-ide/acr-ide/commit/0554835d7a22aaa9d603bb4eda63225f080ee88c))

### [1.9.1](https://code.alipay.com/cloud-ide/acr-ide/compare/v1.9.0...v1.9.1) (2021-01-25)


### Bug Fixes

* remove console.log ([f9b4645](https://code.alipay.com/cloud-ide/acr-ide/commit/f9b46458474f4b9ac14d8b11fa99a20dee3b8992))

## [1.9.0](https://code.alipay.com/cloud-ide/acr-ide/compare/v1.9.0-beta.1...v1.9.0) (2021-01-25)

## [1.9.0-beta.1](https://code.alipay.com/cloud-ide/acr-ide/compare/v1.9.0-beta.0...v1.9.0-beta.1) (2021-01-23)


### Bug Fixes

* hide ellipsis icon in editor/title ([0882ddd](https://code.alipay.com/cloud-ide/acr-ide/commit/0882ddd6dc2a105d0db66f66a474eae01214ce99))
* 当打开被引用的文件时判断文件是否可以编辑 ([97c1de3](https://code.alipay.com/cloud-ide/acr-ide/commit/97c1de3d444982aaa448112936ed78414d1e00cd))
* 改进引用文件的 tab 页签表现 ([88625da](https://code.alipay.com/cloud-ide/acr-ide/commit/88625dafdc733e24f83d052999e0a1d574f840c0))

## [1.9.0-beta.0](https://code.alipay.com/cloud-ide/acr-ide/compare/v1.8.0...v1.9.0-beta.0) (2021-01-20)


### Features

* 切换到新的 editor title menu 实现 ([c925627](https://code.alipay.com/cloud-ide/acr-ide/commit/c9256275115f6e9d664e2fc7e997ccc940e4b5ca))
* 重新实现 editor expand btn ([56c9cae](https://code.alipay.com/cloud-ide/acr-ide/commit/56c9cae039c722f1cd0ff91e0d8954380ac9990d))


### Bug Fixes

* focus in zone-widget when peek references ([32668b3](https://code.alipay.com/cloud-ide/acr-ide/commit/32668b3d5409fa68698825e599038fef23fd13be))
* hover content style ([7025de0](https://code.alipay.com/cloud-ide/acr-ide/commit/7025de0d6bde07ecbf486b433a226a25e359266f))
* ref limit for git-scheme resource provider ([7458a3b](https://code.alipay.com/cloud-ide/acr-ide/commit/7458a3b8c5716b227fd87ab9fe1917ee99ca82c2))
* 总是获取新的内容当文件没有被修改过时 (避免 gbk 编码问题) ([2bdf863](https://code.alipay.com/cloud-ide/acr-ide/commit/2bdf863036930dfd1c27923b42579e147954ad70))

### [1.8.1-beta.1](https://code.alipay.com/cloud-ide/acr-ide/compare/v1.8.0...v1.8.1-beta.1) (2021-01-15)


### Bug Fixes

* focus in zone-widget when peek references ([32668b3](https://code.alipay.com/cloud-ide/acr-ide/commit/32668b3d5409fa68698825e599038fef23fd13be))
* mocks ([58645ac](https://code.alipay.com/cloud-ide/acr-ide/commit/58645ac69075c450719242d8bf11dc23afe8598b))
* 总是获取新的内容当文件没有被修改过时 (避免 gbk 编码问题) ([2bdf863](https://code.alipay.com/cloud-ide/acr-ide/commit/2bdf863036930dfd1c27923b42579e147954ad70))

### [1.8.1-beta.0](https://code.alipay.com/cloud-ide/acr-ide/compare/v1.8.0...v1.8.1-beta.0) (2021-01-15)


### Bug Fixes

* focus in zone-widget when peek references ([32668b3](https://code.alipay.com/cloud-ide/acr-ide/commit/32668b3d5409fa68698825e599038fef23fd13be))
* mocks ([58645ac](https://code.alipay.com/cloud-ide/acr-ide/commit/58645ac69075c450719242d8bf11dc23afe8598b))
* 总是获取新的内容当文件没有被修改过时 (避免 gbk 编码问题) ([2bdf863](https://code.alipay.com/cloud-ide/acr-ide/commit/2bdf863036930dfd1c27923b42579e147954ad70))

## [1.8.0](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.8.0-beta.4...v1.8.0) (2020-12-28)

## [1.8.0-beta.4](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.8.0-beta.3...v1.8.0-beta.4) (2020-12-28)


### Bug Fixes

* dont revealFirstDiff when folding enabled ([933c943](https://code.alipay.com/cloud-ide/ide-cr-component/commit/933c94370359a797314d5a393b76cb5838e3409a))
* focus in changes-tree when auto open first change file ([59d60f3](https://code.alipay.com/cloud-ide/ide-cr-component/commit/59d60f37efea249a8b992095d03f34f4d3e86803))
* text-ellipsis for quick-open desc ([a6005b3](https://code.alipay.com/cloud-ide/ide-cr-component/commit/a6005b3a1d54687ce1955e07530b363f5f56eb72))

## [1.8.0-beta.3](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.8.0-beta.2...v1.8.0-beta.3) (2020-12-28)

## [1.8.0-beta.2](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.8.0-beta.1...v1.8.0-beta.2) (2020-12-28)


### Bug Fixes

* cleanup ([2512dd6](https://code.alipay.com/cloud-ide/ide-cr-component/commit/2512dd6379846dcd2ad28550bfb52a93bea30d03))
* custom color by theme ext ([1c00b6f](https://code.alipay.com/cloud-ide/ide-cr-component/commit/1c00b6fa08da60893acc193057b41bacf48ffaf9))
* keep selection when changing tree mode ([a717a3b](https://code.alipay.com/cloud-ide/ide-cr-component/commit/a717a3b0322638d34cf4c7af26b85de2b05fbc2f))
* menubar bg color ([c540806](https://code.alipay.com/cloud-ide/ide-cr-component/commit/c540806d35b90f163e5d937b350ad3910058f6f3))
* 修复切换版本文件打开错误的问题 ([19a6bc5](https://code.alipay.com/cloud-ide/ide-cr-component/commit/19a6bc5080362c6826c60a739d7229d01ba36e6c))
* 修复折叠后的阴影问题 ([290057a](https://code.alipay.com/cloud-ide/ide-cr-component/commit/290057a7908264da204d29b7d0d36497c66d4f3e))
* 去掉图片边缘透明样式 ([675b505](https://code.alipay.com/cloud-ide/ide-cr-component/commit/675b50566a5398603a79421ad300ed952c011dfd))
* 注销设置面板的快捷键 ([113532d](https://code.alipay.com/cloud-ide/ide-cr-component/commit/113532d19a0644ec0b4f81e38762c60f74d5deee))

## [1.8.0-beta.1](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.8.0-beta.0...v1.8.0-beta.1) (2020-12-24)


### Bug Fixes

* relative path import ([d5b4da1](https://code.alipay.com/cloud-ide/ide-cr-component/commit/d5b4da1cadc6c9956c82236b98c40ac7d4657c1f))

## [1.8.0-beta.0](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.7.5-beta.1...v1.8.0-beta.0) (2020-12-23)


### Features

* 只支持对变更行的评论 ([e140590](https://code.alipay.com/cloud-ide/ide-cr-component/commit/e1405904bd552b5fb8ecc28964b686b194d46b77))


### Bug Fixes

* 各种优化 ([2137d2a](https://code.alipay.com/cloud-ide/ide-cr-component/commit/2137d2a85b303cce924c98a0d1886b2cca864088))

### [1.7.5-beta.1](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.7.5-beta.0...v1.7.5-beta.1) (2020-12-23)

### [1.7.5-beta.0](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.7.4...v1.7.5-beta.0) (2020-12-23)


### Bug Fixes

* add dot for extname from antcode ([2bab0da](https://code.alipay.com/cloud-ide/ide-cr-component/commit/2bab0da85f8e74779b103ba816c5d4731818809e))
* locate in change-tree when quick switch change files ([b48a990](https://code.alipay.com/cloud-ide/ide-cr-component/commit/b48a990a66dfedf7e0c3d31ebbfdd16b931c1137))
* pug 插件的 language id 为 jade ([07f2f36](https://code.alipay.com/cloud-ide/ide-cr-component/commit/07f2f36c395f9ba90ef16f239d8d48e45b1f420b))
* remove useless comments ([4048ed2](https://code.alipay.com/cloud-ide/ide-cr-component/commit/4048ed284b2667138826d74357b5c7708ceba49b))
* 从 antcode 侧获取主语言时使用 agg_type 参数 ([6908776](https://code.alipay.com/cloud-ide/ide-cr-component/commit/6908776684107c461c75052fea84b0daecb492c7))
* 优化 quick-open 查看 change file 的 UI 展示 ([127f25c](https://code.alipay.com/cloud-ide/ide-cr-component/commit/127f25ca84ded196ca76f7f146a40a38c0d83e71))
* 修复在开启折叠后右侧 overviewRuler 阴影部分不对齐的情况 ([412f05a](https://code.alipay.com/cloud-ide/ide-cr-component/commit/412f05ad62b87227d8be15e727ddd0a344bdf0c6))
* 将变更树和 quick-open 等排序使用同一个规则 ([3eb8450](https://code.alipay.com/cloud-ide/ide-cr-component/commit/3eb8450746adf4f8175743c3230c059cef1d9eae))
* 支持 proto/vm 等格式的语言高亮 ([6c73468](https://code.alipay.com/cloud-ide/ide-cr-component/commit/6c7346834e80c5d64a8433c5eb9aaf2b850f1395))
* 默认打开 `代码折叠` ([49498d4](https://code.alipay.com/cloud-ide/ide-cr-component/commit/49498d4c39f287020f71a4ec2ee3dfc29cb29d74))

### [1.7.4](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.7.3...v1.7.4) (2020-11-26)

### [1.7.3](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.7.2...v1.7.3) (2020-11-26)


### Bug Fixes

* 修复 rang 算法在只有新增没有修改的情况下计算错误的问题 ([3f10772](https://code.alipay.com/cloud-ide/ide-cr-component/commit/3f107722f0dee2b44508bbf3ea0e980c8e57bd12))
* 增加 editor empty 页面 ([2a96217](https://code.alipay.com/cloud-ide/ide-cr-component/commit/2a96217e170891f54677a1f045bd51c3c4a96171))
* 增加一个曝光埋点记录 pr 相关 meta 信息并上报到雨燕 ([82b3e23](https://code.alipay.com/cloud-ide/ide-cr-component/commit/82b3e23c667aab770bf3fc8a85ff342b2448e25b))
* 增加更多 language 相关的埋点 ([9c14d3c](https://code.alipay.com/cloud-ide/ide-cr-component/commit/9c14d3c4fb3deaa68b5ad86150fb2bc8ae1cc129))
* 将变更文件切换方式改成通过 Alt + 上下键 ([7f0479c](https://code.alipay.com/cloud-ide/ide-cr-component/commit/7f0479c9ce7ec2c9fd9b701e35388c98c2d4cf3d))

### [1.7.2](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.6.0...v1.7.2) (2020-11-18)


### Features

* 全屏模式下支持通过键盘上下键直接快速切换文件(非 editorFocus 时) ([3caa7ad](https://code.alipay.com/cloud-ide/ide-cr-component/commit/3caa7ad6ea4ccadccb752d554264a3c1e3f8943a))


### Bug Fixes

* 全屏模式下, 切换变更文件快捷键提示文案保持不变 ([af9ec1a](https://code.alipay.com/cloud-ide/ide-cr-component/commit/af9ec1a38d0f2eb611a48be93635d7fcb8568759))

### [1.7.1](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.7.0...v1.7.1) (2020-11-17)

## [1.7.0](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.6.0...v1.7.0) (2020-11-17)


### Features

* 全屏模式下支持通过键盘上下键直接快速切换文件(非 editorFocus 时) ([3caa7ad](https://code.alipay.com/cloud-ide/ide-cr-component/commit/3caa7ad6ea4ccadccb752d554264a3c1e3f8943a))

## [1.6.0](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.6.0-beta.5...v1.6.0) (2020-11-17)

## [1.6.0-beta.5](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.6.0-beta.4...v1.6.0-beta.5) (2020-11-17)


### Bug Fixes

* 先去掉`文本折行`和`忽略收尾空格`选项 ([bfc2ccf](https://code.alipay.com/cloud-ide/ide-cr-component/commit/bfc2ccf00378813376c03b5138f2d351da26b9db))

## [1.6.0-beta.4](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.6.0-beta.3...v1.6.0-beta.4) (2020-11-17)


### Bug Fixes

* text display ([c443753](https://code.alipay.com/cloud-ide/ide-cr-component/commit/c443753ad49b748d2a5b97b88524c3b9eeea2cc2))
* title component in change tree ([f75c480](https://code.alipay.com/cloud-ide/ide-cr-component/commit/f75c480931c340db09c3c7c7d4b0f040635ad02d))
* 修复展开文件内全部折叠的显示效果 ([c889bc5](https://code.alipay.com/cloud-ide/ide-cr-component/commit/c889bc5e68f5555ce47cea07aadd42df69596517))
* 延迟 Popover 关闭, 解决由于 portal 导致的 click 无法响应的问题 ([ef41f83](https://code.alipay.com/cloud-ide/ide-cr-component/commit/ef41f8311362df620a601b491f513b41020c041a))

## [1.6.0-beta.3](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.6.0-beta.2...v1.6.0-beta.3) (2020-11-16)


### Bug Fixes

* 解决 menubar z-index 导致评审按钮对应的弹层被遮挡问题 ([28e3cc7](https://code.alipay.com/cloud-ide/ide-cr-component/commit/28e3cc7fccc1c6f788f3857d1e0f458ef80d8eb1))

## [1.6.0-beta.2](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.6.0-beta.1...v1.6.0-beta.2) (2020-11-16)


### Bug Fixes

* eslint ([5235f7c](https://code.alipay.com/cloud-ide/ide-cr-component/commit/5235f7cef02dcd355b78d026ddb023909a6fe05c))
* 首次提交代码时，自动展开 web-scm 面板 ([745dae2](https://code.alipay.com/cloud-ide/ide-cr-component/commit/745dae27eca87fd9180efb3bf1acc74af7748322))
* 首次提交代码时，自动展开 web-scm 面板 ([bfa17f3](https://code.alipay.com/cloud-ide/ide-cr-component/commit/bfa17f37e9dc00cbf8f5f05ab915c9183e5233b8))

## [1.6.0-beta.1](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.6.0-beta.0...v1.6.0-beta.1) (2020-11-16)

### Bug Fixes

- 将 editor 的 renderSideBySide 选项强制设置为 true 并上报历史使用数据到雨燕监控 ([5e8f099](https://code.alipay.com/cloud-ide/ide-cr-component/commit/5e8f099724b953383ff7840613f7ca1fe1adfe09))

## [1.6.0-beta.0](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.5.2-beta.2...v1.6.0-beta.0) (2020-11-12)

### Features

- support settings in editor.wordWrap ([c578ed9](https://code.alipay.com/cloud-ide/ide-cr-component/commit/c578ed954c7bbbd8d3b216b53b5fc7314ee301e9))

### Bug Fixes

- gbk 编码文件乱码问题 ([be960cb](https://code.alipay.com/cloud-ide/ide-cr-component/commit/be960cb4be983ffe7b24e4829f739cf9bb25daeb))
- 修复 collpase all 的文案 ([2e28480](https://code.alipay.com/cloud-ide/ide-cr-component/commit/2e284800445b0156dfd0085fa83fd835d5f78fd1))
- 修复目录的折叠全部和展开全部 ([2ba80f7](https://code.alipay.com/cloud-ide/ide-cr-component/commit/2ba80f7b128859a42810ce986d59691e674e6983))
- 尝试修复 settings 不同步的问题 ([f42d3a7](https://code.alipay.com/cloud-ide/ide-cr-component/commit/f42d3a713725caa66bec61f6899fff93d7ee0f37))
- 没有变更文件时将 scm 面板默认关闭 ([4e8ce29](https://code.alipay.com/cloud-ide/ide-cr-component/commit/4e8ce2980c6766c181609fd1d7f505c4b53aa8e9))

### [1.5.2-beta.2](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.5.2-beta.0...v1.5.2-beta.2) (2020-11-03)

### [1.5.2-beta.1](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.5.2-beta.0...v1.5.2-beta.1) (2020-10-28)

### [1.5.2-beta.0](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.5.1...v1.5.2-beta.0) (2020-10-28)

### [1.5.1](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.5.0...v1.5.1) (2020-10-26)

### Bug Fixes

- 修正保存文件按钮点击上报时的 d1 ([465ea5c](https://code.alipay.com/cloud-ide/ide-cr-component/commit/465ea5c73d9191b6bcdd162bd92414ea8d4cd154))

## [1.5.0](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.4.0...v1.5.0) (2020-10-26)

### Features

- bump ide-version v1.21.0 ([85158e9](https://code.alipay.com/cloud-ide/ide-cr-component/commit/85158e960932d7eaf6cacc8b9983a30f4222a7b5))
- lsif 埋点增加路径等字段 ([7ae4681](https://code.alipay.com/cloud-ide/ide-cr-component/commit/7ae4681d66850b501866dcc91498984fe02779cc))
- v1.21.0 ([d21bc95](https://code.alipay.com/cloud-ide/ide-cr-component/commit/d21bc95061c638d7177d75e207a4c3c093463dec))
- 增加不同渠道文件打开的埋点上报 ([d8bb125](https://code.alipay.com/cloud-ide/ide-cr-component/commit/d8bb125bc7e30cf67dda1254df5e594560cfdc96))

### Bug Fixes

- add latestCommitSha effect ([70c612a](https://code.alipay.com/cloud-ide/ide-cr-component/commit/70c612aecfeb0417075f852ced204a5d6559f49b))
- type ([22ba082](https://code.alipay.com/cloud-ide/ide-cr-component/commit/22ba0821d3bbc6918b24348480249b50d5bbf673))
- 修复提交时代码冲突的提示文案 ([bea4221](https://code.alipay.com/cloud-ide/ide-cr-component/commit/bea42213bad60ddd7587ee2467053355121b5030))
- 增加保存行为和编辑行为的数据上报 ([cb22026](https://code.alipay.com/cloud-ide/ide-cr-component/commit/cb2202679eaed56ebdc45f64b43052a0a04fc4fe))
- 更改非 commit 不可编辑为禁用,而非隐藏 ([b2cbc28](https://code.alipay.com/cloud-ide/ide-cr-component/commit/b2cbc2835442aac7b54cbcc098862aaa03435ec2))
- 更新空白页的背景图 ([6b4f2bc](https://code.alipay.com/cloud-ide/ide-cr-component/commit/6b4f2bcebd98b17c299b303415e1c2398db411ac))
- 查看变更文件时禁用掉编辑器多余底部留白 ([69ba407](https://code.alipay.com/cloud-ide/ide-cr-component/commit/69ba407ebfbf839712aafed989fd641eb8164771))
- 转到定义不可用 ([7e0f461](https://code.alipay.com/cloud-ide/ide-cr-component/commit/7e0f4611333967fe4be0c5a91194503ee4469e4f))
- 非最新的版本文件禁止编辑 ([1a15547](https://code.alipay.com/cloud-ide/ide-cr-component/commit/1a155471b10e4cdd00fa12aeb69dde4434657ccc))

## [1.4.0](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.3.0...v1.4.0) (2020-10-21)

### Features

- 定时清理 lsif exist 接口缓存 ([d8d26fb](https://code.alipay.com/cloud-ide/ide-cr-component/commit/d8d26fbe09f210974658f87664059920111d920d))

### Bug Fixes

- add disposer ([05634d0](https://code.alipay.com/cloud-ide/ide-cr-component/commit/05634d008fc71bfdbded7383999cc1e0857b24ce))

## [1.3.0](https://code.alipay.com/cloud-ide/ide-cr-component/compare/v1.2.4...v1.3.0) (2020-10-21)

### Features

- lsif 升级使用 antcode 接口 ([3594868](https://code.alipay.com/cloud-ide/ide-cr-component/commit/3594868ec0a4581ad0c3155f79700f0bba9ff67a))
- 使用 createPortal 支持组件跨 React tree 渲染 ([af0ae15](https://code.alipay.com/cloud-ide/ide-cr-component/commit/af0ae1522dc8b1b96ca7fff0b7e3ec9648153dd0))

### Bug Fixes

- hover 超出边界问题 ([84849ff](https://code.alipay.com/cloud-ide/ide-cr-component/commit/84849ffaadd9209241e15160f4d30df8b1162a31))
- portal 多实例渲染问题 ([eb4e987](https://code.alipay.com/cloud-ide/ide-cr-component/commit/eb4e987b3bcf0d28f93bf0efd3aa5fb6df2fbc90))
- scrollbar issue ([dcedb0b](https://code.alipay.com/cloud-ide/ide-cr-component/commit/dcedb0bd37d09511e0603a86be25dc8f9c208060))
- type lint ([e961c05](https://code.alipay.com/cloud-ide/ide-cr-component/commit/e961c059207e0b205021c921ed35b71e14064f7a))
- unmount deps ([cdcd19d](https://code.alipay.com/cloud-ide/ide-cr-component/commit/cdcd19de46d8dc8c75545cfada908573284b6a12))
- use antcode menubar ([43295a5](https://code.alipay.com/cloud-ide/ide-cr-component/commit/43295a579749c4c11c83b4b769c70f588e8272b5))
- 修复 portal 渲染不同步问题 ([e925d09](https://code.alipay.com/cloud-ide/ide-cr-component/commit/e925d09f314fec16d1eeedb9c7d05046389eabf8))
