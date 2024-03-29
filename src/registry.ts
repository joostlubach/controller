import { Constructor } from 'ytil'

import { Action, ErrorHandler, Middleware } from './types'

export interface RegistryEntry<C> {
  bases?:        string[]
  actions:       Action[]
  middleware:    Middleware<C>[]
  errorHandlers: ErrorHandler[]
}

const REGISTRY = new WeakMap<Constructor<any>, RegistryEntry<any>>()

const registry = {
  get<C>(controller: Constructor<C>): RegistryEntry<C> {
    let entry = REGISTRY.get(controller)
    if (entry == null) {
      entry = defaultEntry()
      REGISTRY.set(controller, entry)
    }

    return entry
  },
}

export default registry

function defaultEntry(): RegistryEntry<any> {
  return {
    actions:       [],
    middleware:    [],
    errorHandlers: [],
  }
}
