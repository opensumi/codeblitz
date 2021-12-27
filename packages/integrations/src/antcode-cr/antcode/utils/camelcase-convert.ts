export function underscoreToCamelcase<T = unknown>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => underscoreToCamelcase(item)) as any as T;
  }
  if (typeof obj !== 'object' || obj === null || obj === undefined) {
    return obj;
  }
  const ret: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty && !obj.hasOwnProperty(key)) {
      continue;
    }
    const newKey = key.replace(/_([a-z])/g, (m) => m[1].toUpperCase());
    ret[newKey] = underscoreToCamelcase(obj[key]);
  }
  return ret as T;
}

export function camelcaseToUnderscore<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => camelcaseToUnderscore(item)) as any as T;
  }
  if (typeof obj !== 'object' || obj === null || obj === undefined) {
    return obj;
  }
  const ret: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty && !obj.hasOwnProperty(key)) {
      continue;
    }
    const newKey = key.replace(/([a-z][A-Z])/g, (m) => m[0] + '_' + m[1].toLowerCase());
    ret[newKey] = camelcaseToUnderscore(obj[key]);
  }
  return ret as T;
}
