import { Action, ControllerConstructor, ErrorHandler, Middleware } from './types'

export interface RegistryEntry {
  bases?:        string[]
  actions:       Action[]
  middleware:    Middleware[]
  errorHandlers: ErrorHandler[]
}

const REGISTRY: WeakMap<ControllerConstructor<any>, RegistryEntry> = new WeakMap()

const registry = {
  get(controller: ControllerConstructor<any>): RegistryEntry {
    let entry = REGISTRY.get(controller)
    if (entry == null) {
      entry = defaultEntry()
      REGISTRY.set(controller, entry)
    }

    return entry
  },
}

export default registry

function defaultEntry(): RegistryEntry {
  return {
    actions:       [],
    middleware:    [],
    errorHandlers: [],
  }
}