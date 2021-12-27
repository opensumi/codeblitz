import { Tenant } from './tenant';
import { Access } from './access';

export interface Namespace {
  avatar: {
    url: string;
  };
  createdAt: string; //date
  description: string;
  id: number;
  name: string;
  owner: string;
  ownerId: number;
  path: string;
  permission: {
    groupAccess?: Access;
    tenantAccess?: Access;
  };
  public: boolean;
  state: string;
  tenant: Tenant;
  type: string;
  updatedAt: string; //date
  webUrl: string;
}
