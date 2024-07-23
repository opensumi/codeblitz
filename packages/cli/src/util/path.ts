import path from 'path';

export function resolveCWDPkgJSON() {
  const initCWD = process.env.INIT_CWD || process.cwd();
  return path.resolve(initCWD, 'package.json');
}
