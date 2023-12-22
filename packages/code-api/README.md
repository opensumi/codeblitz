# code-api
English | [简体中文](./README-zh_CN.md)
## Code Service Integration API

### How to Develop
#### [Github](https://github.com/)
- Configure [PrivateToken](https://github.com/settings/tokens/new?scopes=repo&description=codeblitz) by yourself
- API Reference
  1. [Github REST API](https://docs.github.com/rest)
  2. [Github GraphQL API](https://docs.github.com/graphql)
#### [GitLab](https://gitlab.cn/)
- Provide basic code service API for self-integration. Modify the default configuration in packages/code-api/src/common/config.ts
- [GitLab API](https://docs.gitlab.com/ee/api/)
- Local Development
  ```bash
  # 1. start server
  npm run start

  # 2. open url
  http://localhost:9009/gitlab/${group}/${name}
  ```

#### [AtomGit](https://atomgit.com/)
- Configure [Private Token](https://atomgit.com/-/profile/tokens) by yourself
- API Reference: [AtomGit API](https://docs.atomgit.com/category/api)
- Local Development
  ```bash
  # 1. start server
  npm run start
  # 2. set  AtomGit Token in packages/startup/src/startup/index.tsx 

    CodeServiceModule.Config({
      ...
      atomgit: {
        // atomgit token https://atomgit.com/-/profile/tokens
        token: 'your token'
      }
      ...
    })

  # 3. open url
  http://localhost:9009/atomgit/opensumi/codeblitz
  ```
#### [GitLink](https://www.gitlink.org.cn/)  
- APIReference: [GitLink API](https://www.gitlink.org.cn/docs/api#introduction)
- Introduction: [GitLink WebIDE](https://help.gitlink.org.cn/%E4%BB%A3%E7%A0%81%E5%BA%93%E7%AE%A1%E7%90%86/WebIDE)
- Local Development
  ```bash
  # 1. set .env file
  CODE_SERVICE_HOST=https://www.gitlink.org.cn
  # 2. set gitlnk cookie  
  set Cookie in packages/toolkit/webpack/config.dev.js from https://www.gitlink.org.cn response header
  # 3. start server
  npm run start
  # 3. open url
  http://localhost:9009/gitlink/opensumi/core
  ```

#### [Gitee](https://gitee.com/) 
- APIReference: [Gitee API](https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoStargazers?ex=no)
- Example: [WebIDE for Gitee](https://codeblitz.cloud.alipay.com/gitee/opensumi/codeblitz)
- Local Development
  ```bash
  # 1. set Gitee Token in packages/startup/src/startup/index.tsx
      CodeServiceModule.Config({
        ...
        gitee: {
          ## set gitee file request  recursive: true
          recursive: true,
          ## gitee token https://gitee.com/profile/personal_access_tokens
          token: 'your token'
        },
        ...
    })
  # 3. start server
  npm run start
  # 3. open url
  http://localhost:9009/gitee/opensumi/codeblitz
  ```

#### [Codeup](https://codeup.aliyun.com)
- APIReference: [Codeup API](https://help.aliyun.com/document_detail/2527054.html)
- Introduction: [Codeup WebIDE](https://mp.weixin.qq.com/s/CFrxYdFxbj53JRqGDqAH-A?poc_token=HI1nhWWjDV_9mGYXCa3tjkBesVjvosq1JYEiXo6m)
- Local Development
  ```bash
  # 1. set .env file
  CODE_SERVICE_HOST=https://codeup.aliyun.com
  # 2. set codeup cookie   
  
  set Cookie in packages/toolkit/webpack/config.dev.js from https://codeup.aliyun.com response header

  # 3. set codeup projectId
    codeup: {
      owner: 'your owner',
      name: 'your name',
      projectId: 'your projectId', # require
    }

  # 3. start server
  npm run start
  # 3. open url
  http://localhost:9009/codeup/${owner}/${name}

  ```
