import { ControllerConstructor, MiddlewareFunction, MiddlewareOptions } from '../types'
import registry from '../registry'

export function use(func: MiddlewareFunction, options: MiddlewareOptions = {}) {
  return (target: any) => {
    const Controller = target as ControllerConstructor
    const entry = registry.get(Controller)
    entry.middleware.push({func, options})
  }
}