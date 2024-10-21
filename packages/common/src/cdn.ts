export type TComponentCDNType = 'unpkg' | 'jsdelivr' | 'alipay' | 'npmmirror';

type IComponentCDNTypeMap = Record<TComponentCDNType, string>;

const CDN_TYPE_MAP: IComponentCDNTypeMap = {
  alipay: 'https://gw.alipayobjects.com/os/lib',
  npmmirror: 'https://registry.npmmirror.com',
  unpkg: 'https://unpkg.com/browse',
  jsdelivr: 'https://cdn.jsdelivr.net/npm',
};

export function getResource(
  packageName: string,
  filePath: string,
  version: string,
  cdnType: TComponentCDNType = 'alipay',
) {
  if (cdnType === 'alipay') {
    return `${CDN_TYPE_MAP['alipay']}/${packageName.slice(1)}/${version}/${filePath}`;
  } else if (cdnType === 'npmmirror') {
    return `${CDN_TYPE_MAP['npmmirror']}/${packageName}/${version}/files/${filePath}`;
  } else {
    return `${CDN_TYPE_MAP[cdnType]}/${packageName}@${version}/${filePath}`;
  }
}
