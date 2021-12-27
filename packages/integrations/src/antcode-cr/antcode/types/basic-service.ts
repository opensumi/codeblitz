import { AccessLevel } from './user';

export interface BasicService {
  accessLevel: AccessLevel;
  active: boolean;
  avatarUrl: string;
  checksDependOn: string;
  description: string;
  homepage: string;
  id: number;
  name: BasicServiceEnum;
  nameShow: string;
  serviceType: BasicServiceType;
  stuck: boolean; // 是否卡点
  helpUrl?: string;
}

export enum BasicServiceType {
  BasicQuality = 'BASIC_QUALITY',
  BasicService = 'BASIC_SERVICE',
  ThirdService = 'THIRD_SERVICE',
}

export enum BasicServiceEnum {
  ACI = 'ACI',
  CodeInsight = 'CodeInsight',
}
