import { Method, ParamConverterMap, ControllerConstructor, ErrorHandler } from '../types'
import registry from '../registry'

export const get   = actionDecorator('get')
export const post  = actionDecorator('post')
export const put   = actionDecorator('put')
export const patch = actionDecorator('patch')
export const del   = actionDecorator('delete')

function actionDecorator(method: Method) {
  return (path: string, paramConverters: ParamConverterMap = {}) => {
    return (target: any, key: string) => {
      const Controller = target.constructor
      const entry = registry.get(Controller)

      entry.actions.push({
        name: key,
        path,
        method,
        paramConverters,
        errorHandlers: resolveErrorHandlers(Controller),
      })
    }
  }
}

function resolveErrorHandlers(Controller: ControllerConstructor): ErrorHandler[] {
  const Super         = getSuperConstructor(Controller)
  const errorHandlers = Super == null ? [] : resolveErrorHandlers(Super)
  const entry         = registry.get(Controller)

  return [...errorHandlers, ...entry?.errorHandlers ?? []]
}

function getSuperConstructor(Constructor: AnyConstructor) {
  return Constructor.prototype?.__proto__?.constructor
}