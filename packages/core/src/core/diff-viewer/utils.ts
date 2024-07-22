export function removeStart(str: string, pattern: string) {
  if (str.startsWith(pattern)) {
    return str.slice(pattern.length);
  }
  return str;
}
