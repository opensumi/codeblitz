import { User } from './user';

export interface Review {
  id: number;
  type: string; //enum User,Email
  email: string;
  subscribed: boolean;
  user: User;
}

export interface ReviewsSettings {
  id: number;
  createdAt: string; //date
  updatedAt: string; //date
  projectId: number;
  threshold: number;
  rulesType: string;
  thresholdClear: boolean;
  submitterCanReview: boolean;
}

export interface PRSubscription {
  id: number;
  type: 'USER' | 'EMAIL'; // 订阅者类型,
  user: User;
  email: string; // 邮箱,
  subscribed: boolean; // 是否订阅
}
