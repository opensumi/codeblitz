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

export interface Thenable<T> {
  then<TResult>(
    onfulfilled?: (value: T) => TResult | Thenable<TResult>,
    onrejected?: (reason: any) => TResult | Thenable<TResult>
  ): Thenable<TResult>;
  then<TResult>(
    onfulfilled?: (value: T) => TResult | Thenable<TResult>,
    onrejected?: (reason: any) => void
  ): Thenable<TResult>;
}
