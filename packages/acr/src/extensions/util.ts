export function getMarketPlaceUrl(publisher: string, name: string, version: string) {
  return [
    'kt-ext://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/marketplace/extension',
    `/${publisher}.${name}-${version}`,
  ].join('');
}
