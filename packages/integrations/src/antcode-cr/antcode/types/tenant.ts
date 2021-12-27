import { Access } from './access';

export interface Tenant {
  id: number;
  name: string;
  path: string;
  createdAt: string;
  updatedAt: string;
  permission?: {
    tenantAccess: Access;
  };
}
