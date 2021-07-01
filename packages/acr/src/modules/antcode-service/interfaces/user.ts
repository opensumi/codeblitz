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
}

export type UserWithAccessLevel = User & {
  accessLevel: number;
  department?: string;
};
