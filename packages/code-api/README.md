# code-api

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

TODO
1. [Gitee](https://gitee.com/)
2. [Codeup](https://codeup.aliyun.com)
