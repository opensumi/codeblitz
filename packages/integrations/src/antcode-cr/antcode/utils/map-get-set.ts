export function mapGetSet<K, V>(map: Map<K, V>, key: K, fallback: () => V) {
  let ret = map.get(key);
  if (!ret) {
    ret = fallback();
    map.set(key, ret);
  }
  return ret;
}
