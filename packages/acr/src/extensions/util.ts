export function getMarketPlaceUrl(publisher: string, name: string, version: string) {
  return [
    'kt-ext://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/marketplace/assets',
    `/${publisher}.${name}/v${version}/extension`,
  ].join('');
}
