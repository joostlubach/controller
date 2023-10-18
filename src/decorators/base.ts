import registry from '../registry'
import { ControllerConstructor } from '../types'

export function base(...bases: string[]) {
  return (target: any) => {
    const Controller = target as ControllerConstructor<any>
    const entry = registry.get(Controller)
    ;(entry.bases ??= []).push(...bases)
  }
}