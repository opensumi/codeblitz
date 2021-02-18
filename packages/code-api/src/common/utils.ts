export const stripLeadingSlash = (path: string) => (path.charAt(0) === '/' ? path.substr(1) : path);

export const stripTrailingSlash = (path: string) =>
  path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;

export const createUrl = (origin: string, path: string) =>
  `${stripTrailingSlash(origin)}/${stripLeadingSlash(path)}`;
