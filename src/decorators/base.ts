import { ControllerConstructor } from '../types'
import registry from '../registry'

export function base(base: string) {
  return (target: any) => {
    const Controller = target as ControllerConstructor
    const entry = registry.get(Controller)
    ;(entry.bases ??= []).push(base)
  }
}