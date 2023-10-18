import registry from '../registry'
import { ControllerConstructor, MiddlewareFunction, MiddlewareOptions } from '../types'

export function use(func: MiddlewareFunction, options: MiddlewareOptions = {}) {
  return (target: any) => {
    const Controller = target as ControllerConstructor<any>
    const entry = registry.get(Controller)
    entry.middleware.push({func, options})
  }
}