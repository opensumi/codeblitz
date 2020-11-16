/**
 * @class Mutex 使用 id 互斥操作
 */

type MutextId = string | number | symbol

export class Mutex {
  private _waiting = new Map<
    MutextId,
    {
      resolveList: ((value: (id: MutextId) => void) => void)[]
      unlock: (id: MutextId) => void
    }
  >()

  lock(id: string) {
    if (!this._waiting.has(id)) {
      this._waiting.set(id, {
        resolveList: [],
        unlock: this.unlock.bind(this, id),
      })
    }
    return new Promise<(id: MutextId) => void>((resolve) => {
      const { resolveList, unlock } = this._waiting.get(id)!
      resolveList.push(resolve)
      if (resolveList.length === 1) {
        resolve(unlock)
      }
    })
  }

  unlock(id: string) {
    if (!this._waiting.has(id)) {
      throw new Error(`no lock for ${id}`)
    }
    const { resolveList, unlock } = this._waiting.get(id)!
    resolveList.shift()
    if (resolveList.length > 0) {
      resolveList[0](unlock)
    } else {
      this._waiting.delete(id)
    }
  }
}

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
