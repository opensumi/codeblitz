export interface User {
  id: number;
  name: string;
  username: string;
  email: string; // get email
  state: string;
  avatar: string;
  externUid: string;
  webUrl: string; // 获取用户的个人页面
  avatarUrl: string;
  isAdmin: boolean;
  department: string; // 部门
}

export enum AccessLevel {
  null = 0,
  guest = 10,
  reporter = 20,
  developer = 30,
  master = 40,
  owner = 50,
}
