import { Constructor, TypedClassDecorator } from 'ytil'
import registry from '../registry'
import { MiddlewareFunction, MiddlewareOptions } from '../types'

export function use<C extends Constructor<any>>(func: MiddlewareFunction<InstanceType<C>>, options: MiddlewareOptions = {}): TypedClassDecorator<C> {
  return Controller => {
    const entry = registry.get(Controller)
    entry.middleware.push({func, options})
  }
}