import { ComponentType } from 'react';

export interface RootProps {
  status: 'loading' | 'success' | 'error';
  errorMessage?: string;
  Landing?: ComponentType;
}
