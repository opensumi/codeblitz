# code-api

简体中文 | [English](./README.md)

## 代码服务对接API

### 如何开发
#### [Github](https://github.com/)
- 自行配置 [PrivateToken](https://github.com/settings/tokens/new?scopes=repo&description=codeblitz)
- API参考
  1. [Github REST API](https://docs.github.com/zh/rest)
  2. [Github GraphQL API](https://docs.github.com/zh/graphql)

#### [GitLab](https://gitlab.cn/)
- 提供基础代码服务API请自行集成 修改 packages/code-api/src/common/config.ts 默认配置
- [GitLab API](https://docs.gitlab.com/ee/api/)
- 本地开发
  ```bash
  # 1. 启动服务
  npm run start

  # 2. 访问地址
  http://localhost:9009/gitlab/${group}/${name}
  ```

#### [AtomGit](https://atomgit.com/)
- 自行配置 [Private Token](https://atomgit.com/-/profile/tokens)
- API参考 [AtomGit API](https://docs.atomgit.com/category/api)
- 本地开发
  ```bash
  # 1. 启动服务
  npm run start
  # 2. 在 packages/startup/src/startup/index.tsx 设置 AtomGit Token

    CodeServiceModule.Config({
      ...
      atomgit: {
        ## atomgit token https://atomgit.com/-/profile/tokens
        token: 'your token'
      }
      ...
    })

  # 3. 访问地址
  http://localhost:9009/atomgit/opensumi/codeblitz
  ```

#### [GitLink](https://www.gitlink.org.cn/)  
- API参考: [GitLink API](https://www.gitlink.org.cn/docs/api#introduction)
- 介绍: [GitLink WebIDE](https://help.gitlink.org.cn/%E4%BB%A3%E7%A0%81%E5%BA%93%E7%AE%A1%E7%90%86/WebIDE)
- 本地开发
  ```bash
  # 1. 修改本地配置 .env 文件
  CODE_SERVICE_HOST=https://www.gitlink.org.cn
  # 2. 配置 gitlnk cookie  
  在 packages/toolkit/webpack/config.dev.js 内添加 代理Cookie 可以从https://www.gitlink.org.cn 任意响应头中获取
  # 3. 启动服务
  npm run start
  # 3. 访问地址
  http://localhost:9009/gitlink/opensumi/core
  ```

#### [Gitee](https://gitee.com/) 
- API参考: [Gitee API](https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoStargazers?ex=no)
- 示例: [WebIDE for Gitee](https://codeblitz.cloud.alipay.com/gitee/opensumi/codeblitz)
- 本地开发
  ```bash
  # 1. 在 packages/startup/src/startup/index.tsx 设置 Gitee Token
      CodeServiceModule.Config({
        ...
        gitee: {
          ## gitee 文件接口为递归接口
          recursive: true,
          ## gitee token https://gitee.com/profile/personal_access_tokens
          token: 'your token'
        },
        ...
    })
  # 3. 启动服务
  npm run start
  # 3. 访问地址
  http://localhost:9009/gitee/opensumi/codeblitz
  ```

#### [Codeup](https://codeup.aliyun.com)
- API参考: [Codeup API](https://help.aliyun.com/document_detail/2527054.html)
- 介绍: [Codeup WebIDE](https://mp.weixin.qq.com/s/CFrxYdFxbj53JRqGDqAH-A?poc_token=HI1nhWWjDV_9mGYXCa3tjkBesVjvosq1JYEiXo6m)
- 本地开发
  ```bash
  # 1. 修改本地配置 .env 文件
  CODE_SERVICE_HOST=https://codeup.aliyun.com
  # 2. 配置 codeup cookie  
  
  在 packages/toolkit/webpack/config.dev.js 内添加 代理Cookie 可以从 https://codeup.aliyun.com 任意响应头中获取

  # 3. 配置 codeup projectId 因为codeup以项目为单位进行权限控制，需要配置projectId
    codeup: {
      owner: 'your owner',
      name: 'your name',
      projectId: 'your projectId', # 项目 id 必须
    }

  # 3. 启动服务
  npm run start
  # 3. 访问地址
  http://localhost:9009/codeup/${owner}/${name}

  ```




 