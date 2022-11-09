import { ControllerConstructor, Action, Middleware, ErrorHandler } from './types'

export interface RegistryEntry {
  bases?:        string[]
  actions:       Action[]
  middleware:    Middleware[]
  errorHandlers: ErrorHandler[]
}

const registry: WeakMap<ControllerConstructor, RegistryEntry> = new WeakMap()

export default {
  get(controller: ControllerConstructor): RegistryEntry {
    let entry = registry.get(controller)
    if (entry == null) {
      entry = defaultEntry()
      registry.set(controller, entry)
    }

    return entry
  },
}

function defaultEntry(): RegistryEntry {
  return {
    actions:       [],
    middleware:    [],
    errorHandlers: [],
  }
}