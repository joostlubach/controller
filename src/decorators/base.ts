import { Constructor, TypedClassDecorator } from 'ytil'
import registry from '../registry'

export function base<C extends Constructor<any>>(...bases: string[]): TypedClassDecorator<C> {
  return (target) => {
    const entry = registry.get(target)
    ;(entry.bases ??= []).push(...bases)
  }
}
