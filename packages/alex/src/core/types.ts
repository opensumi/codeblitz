import { ComponentType } from 'react';
import { ThemeType } from '@ali/ide-theme';

export interface LandingProps {
  status: 'loading' | 'success' | 'error';
  error?: string;
  theme?: ThemeType;
  className?: string;
}

export interface RootProps extends LandingProps {
  Landing?: ComponentType<LandingProps>;
}
