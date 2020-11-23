import { IExtensionIdentity } from '@alipay/spacex-shared'
import { EXT_SCHEME } from './constant'

/**
 * 获取对象上所有函数的 property
 */
export const getFunctionProps = (obj: Record<string, any>): string[] => {
  const props = new Set<string>()

  // class 上的原型方法不可遍历
  if (/^class\s/.test(Function.prototype.toString.call(obj.constructor))) {
    addFunctionProps(obj, 'getOwnPropertyNames')
  } else {
    addFunctionProps(obj, 'keys')
  }

  return [...props]

  function addFunctionProps(obj: Record<string, any>, key: 'getOwnPropertyNames' | 'keys') {
    do {
      Object[key](obj).forEach((prop) => {
        const descriptor = Object.getOwnPropertyDescriptor(obj, prop)
        // 避免 getter 取值报错
        if (descriptor && typeof descriptor.value === 'function') {
          props.add(prop)
        }
      })
    } while ((obj = Object.getPrototypeOf(obj)))
  }
}

export const getExtensionPath = (ext: IExtensionIdentity) => {
  return [
    EXT_SCHEME,
    '://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/marketplace/assets/',
    `${ext.publisher}.${ext.name}/v${ext.version}/extension`,
  ].join('')
}
