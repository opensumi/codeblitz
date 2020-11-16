/**
 * Function Call Service Connection
 * 连接 Cline 和 Server, RPC 的模拟实现
 */

import { getFunctionProps } from '../common/util'

export interface Port {
  listen(cb: (...args: any[]) => any): void
  call(...args: any): any
}

const createChannel: () => { port1: Port; port2: Port } = () => {
  type InnerPort = {
    callback(...args: any[]): any
    listen(cb: (...args: any[]) => any): void
    call(...args: any[]): any
    _entangledPort: InnerPort | null
  }

  const noop = () => {}

  const createPort: (name: string) => InnerPort = (name) => ({
    _entangledPort: null,
    _name: name,
    callback: noop,
    listen(cb: (...args: any[]) => any) {
      this.callback = cb
    },
    call(...args: any) {
      return this._entangledPort?.callback(...args)
    },
  })

  const port1 = createPort('client')
  const port2 = createPort('server')
  port1._entangledPort = port2
  port2._entangledPort = port1
  return { port1, port2 }
}

const { port1, port2 } = createChannel()

export { port1 as ClientPort, port2 as ServerPort }

export abstract class FCService {
  client?: any
}

export const NOTREGISTERMETHOD = '$$NOTREGISTERMETHOD'

export type FCServiceMethod = (...args: any[]) => any
export type ServiceProxy = any

export enum ServiceType {
  Service,
  Stub,
}

export function initFCService(center: FCServiceCenter) {
  return {
    createFCService: (name: string, service?: any): any => {
      const proxy = new FCServiceStub(name, center, ServiceType.Service).getProxy()
      if (service) {
        proxy.onRequestService(service)
      }

      return proxy
    },
    getFCService: (name: string): any => {
      return new FCServiceStub(name, center, ServiceType.Stub).getProxy()
    },
  }
}

export function createFCService(name: string, center: FCServiceCenter): any {
  return new FCServiceStub(name, center, ServiceType.Service).getProxy()
}

export function getFCService(name: string, center: FCServiceCenter): any {
  return new FCServiceStub(name, center, ServiceType.Stub).getProxy()
}

export class FCServiceCenter {
  private serviceMethodMap = {}

  constructor(private port: Port, private logger?: any) {
    this.logger = logger || console
    this.port.listen((name, args) => {
      if (!this.serviceMethodMap[name]) {
        return NOTREGISTERMETHOD
      }
      return this.serviceMethodMap[name](...args)
    })
  }

  when() {
    return true
  }

  onRequest(name: string, method: FCServiceMethod) {
    this.serviceMethodMap[name] = method
  }

  async broadcast(name: string, ...args: any[]): Promise<any> {
    if (name.startsWith('on')) {
      this.port.call(name, args)
      return
    }
    return this.port.call(name, args)
  }
}

/**
 * RPCServiceStub 的兼容实现
 */
export class FCServiceStub {
  constructor(
    private serviceName: string,
    private center: FCServiceCenter,
    private type: ServiceType
  ) {}

  async ready() {
    return this.center.when()
  }

  getNotificationName(name: string) {
    return `on:${this.serviceName}:${name}`
  }

  getRequestName(name: string) {
    return `${this.serviceName}:${name}`
  }

  on(name: string, method: FCServiceMethod) {
    this.onRequest(name, method)
  }

  getServiceMethod(service: any): string[] {
    return getFunctionProps(service)
  }

  onRequestService(service: any) {
    const methods = this.getServiceMethod(service)
    for (const method of methods) {
      this.onRequest(method, service[method].bind(service))
    }
  }

  onRequest(name: string, method: FCServiceMethod) {
    this.center.onRequest(this.getMethodName(name), method)
  }

  broadcast(name: string, ...args: any[]) {
    return this.center.broadcast(this.getMethodName(name), ...args)
  }

  getMethodName(name: string) {
    return name.startsWith('on') ? this.getNotificationName(name) : this.getRequestName(name)
  }

  getProxy = () => {
    return new Proxy(this, {
      // 调用方
      get: (target, prop: string) => {
        if (!target[prop]) {
          if (typeof prop === 'symbol') {
            return Promise.resolve()
          } else {
            return async (...args: any[]) => {
              await this.ready()
              const result = await this.broadcast(prop, ...args)
              return result === NOTREGISTERMETHOD ? undefined : result
            }
          }
        } else {
          return target[prop]
        }
      },
    })
  }
}

// 避免 getter 取值
function checkPropIsFunction(obj: any, prop: string) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop)
  return descriptor && typeof descriptor.value === 'function'
}
