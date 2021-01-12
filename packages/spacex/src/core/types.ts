export interface RootProps {
  theme: 'dark' | 'light';
  status: 'loading' | 'success' | 'error';
  errorMessage?: string;
}
