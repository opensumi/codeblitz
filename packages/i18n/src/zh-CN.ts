export const localizationBundle = {
  languageId: 'zh-CN',
  languageName: 'Chinese',
  localizedLanguageName: '中文(中国)',
  contents: {
    // override opensumi
    // 极速版暂无回收站，在这里覆盖
    'file.confirm.delete.ok': '确定',
    'common.save': '保存',
    'common.reset': '重置',
    'common.clear': '清除',
    'common.cancel': '取消',
    'common.continue': '继续',
    'common.ref-doc': '参考文档',
    'common.refresh': '刷新',
    'menu.help.welcome': '欢迎使用',
    'workspace.initialize.failed': '工作空间目录初始化失败',
    'common.close': '关闭',
    'common.command.file.search': '打开搜索面板',
    'common.command.quickopen.command-terminal': '打开命令面板',
    'product.description': '基于 OpenSumi 的纯前端版 IDE 框架',
    'api.request.error': '请求错误',
    'api.response.unknown-error': '未知错误',
    'api.response.project-not-found': '{0} 不存在',
    'api.response.project-no-access': '无权限访问项目',
    'api.response.no-login-code': 'code 登录已失效，如已登录请刷新页面',
    'api.login.goto': '前往登录',
    'error.unknown': '未知错误',
    'error.request': '请求错误',
    'error.resource-not-found': '项目或资源不存在',

    'code-service.command.create-branch': '创建分支',
    'code-service.command.create-branch-from': '从...创建分支',
    'code-service.command.create-branch-error-exists': '分支已存在 {0}',
    'code-service.command.create-branch-error': '分支创建失败 {0}',
    'code-service.command.create-branch-success': '分支 {0} 创建成功',
    'code-service.command.new-branch-name': '输入新分支',
    'code-service.command.check-branch-name': '检查分支名是否正确',
    'code-service.command.select-ref-to-create-branch': '选择一个ref 创建 {0}分支',
    'code-service.command.scm-checkout-info': '切换分支将丢失所有更改',

    'code-service.command.checkout': '签出...',
    'code-service.checkout': '切换分支或标签...',
    'code-service.select-ref-to-checkout': '选择签出的 ref',
    'code-service.checkout-to': '签出 {0}',
    'code-service.checkout-to-same': 'commit 分支 无变化',
    'code-service.submodules-not-found': '未找到 {0} 的 submodules',
    'code-service.submodules-parse-error': '解析 submodules {0} 失败',

    'github.invalid-token': 'token 无效',
    'github.request-rate-limit': '超出 API 速率限制',
    'github.request-rate-limit-with-token': '当前请求已超出限制，请等待重置后再重试',
    'github.resource-not-found': '资源不存在',
    'github.rate-limiting-info': '速率限制信息',
    'github.rate-limit-limit': '限制：',
    'github.rate-limit-remaining': '剩余：',
    'github.rate-limit-reset': '重置时间：',
    'github.rate-limit-used': '已用：',
    'github.auth-title': '设置 OAuth Token',
    'github.auth-tip': '设置 OAuth Token，提高 GitHub 请求上限数至 5000 次',
    'github.auth-goto': '点击前往生成',
    'github.auth-input': '输入',
    'github.auth-has-token-title': '已设置 OAuth Token',
    'github.auth-cur-token': '当前 OAuth Token',
    'github.toggle-graphql': '切换请求方式为 GraphQL',

    'gitlab.invalid-token': 'Private Token 无效',
    'gitlab.unauthorized': '未授权，请输入 Private Token',
    'gitlab.auth-title': '设置 Private Token',
    'gitlab.auth-tip': '需要提供 Private Token，才能访问 GitLab 仓库',
    'gitlab.auth-goto': '点击前往获取',
    'gitlab.auth-input': '输入',
    'gitlab.auth-has-token-title': '已设置 Private Token',
    'gitlab.auth-cur-token': '当前 Private Token',
  },
};
