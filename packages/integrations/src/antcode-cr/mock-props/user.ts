import { User } from '@alipay/acr-ide/lib/modules/antcode-service/interfaces/user';

export const user = ({
  avatarUrl: 'https://via.placeholder.com/300/09f.png',
  bio: null,
  canCreateGroup: true,
  canCreateProject: null,
  colorSchemeId: 1,
  createdAt: '2020-02-17T11:02:19+0800',
  currentSignInAt: '2020-09-06T21:00:09+0800',
  department: '蚂蚁集团-CTO线-研发效能部-研发技术平台-CloudIDE',
  email: 'test@test.com',
  externUid: '146194',
  id: 15165,
  identities: [
    {
      externUid: '146194',
      provider: 'buc',
    },
  ],
  isAdmin: false,
  name: '大黄蜂',
  privateToken: 'jl6C6LZ-MD1iEqKy0WZN',
  projectsLimit: 20,
  role: 0,
  state: 'active',
  themeId: 2,
  updatedAt: '2020-09-06T21:00:09+0800',
  username: 'taian.lta',
  webUrl: '/u/taian.lta/',
  websiteUrl: '',
} as unknown) as User;
