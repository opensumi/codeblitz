import { ThemeType } from '@opensumi/ide-theme';
import { ComponentType } from 'react';

export interface LandingProps {
  status: 'loading' | 'success' | 'error';
  error?: string;
  theme?: ThemeType;
  className?: string;
}

export interface RootProps extends LandingProps {
  Landing?: ComponentType<LandingProps>;
  children?: React.ReactNode;
}
