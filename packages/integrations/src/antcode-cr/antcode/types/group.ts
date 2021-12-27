import { Access } from './access';
import { Tenant } from './tenant';

export interface Group {
  avatarUrl: string;
  createdAt: string; //date
  description: string;
  id: number;
  membersTotal: number;
  name: string;
  path: string;
  permission: {
    groupAccess?: Access;
    tenantAccess?: Access;
  };
  projectsTotal: number;
  public: boolean;
  tenant: Tenant;
  updatedAt: string; //date
  webUrl: string;
}
