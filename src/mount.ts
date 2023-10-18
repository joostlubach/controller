import chalk from 'chalk'
import { Express, NextFunction, Request, Response, Router } from 'express'
import { isArray } from 'lodash'
import { objectValues } from 'ytil'
import config from './config'
import HTTPError from './HTTPError'
import registry from './registry'
import { Action, ControllerConstructor, Middleware, MountOptions } from './types'

interface ControllerMap {
  [name: string]: ControllerConstructor<any>
}
type ControllerArray = ControllerConstructor<any>[]

export default function mount(app: Express, controllers: ControllerConstructor<any>[], options: MountOptions = {}): void
export default function mount(app: Express, controllers: ControllerMap | ControllerArray, options: MountOptions = {}) {
  const array = isArray(controllers) ? controllers : objectValues(controllers)
  for (const Controller of array) {
    mountController(app, Controller, options)
  }
}

function mountController(app: Express, Controller: ControllerConstructor<any>, options: MountOptions) {
  const entry = registry.get(Controller)

  config.logger.info(chalk`-> Mounting controller {yellow ${Controller.name}}`)
  const bases = entry.bases ?? [null]

  for (const base of bases) {
    for (const action of entry.actions) {
      mountAction(app, Controller, action, entry.middleware, base, options)
    }
  }
}

function mountAction(
  app:        Express,
  Controller: ControllerConstructor<any>,
  action:     Action,
  middleware: Middleware[],
  base:       string | null,
  options:    MountOptions
) {
  const {name, path, method} = action

  let fullPath = path.startsWith('/') ? path :
    base == null ? `/${path}` :
    `/${base}/${path}`

  fullPath = fullPath.replace(/\/{2,}/g, '/')

  config.logger.info(chalk`    • Mounting {yellow ${method.toUpperCase()} ${fullPath}} => {blue ${Controller.name}::${name}}`)

  const boundAction = bindAction(Controller, action, middleware, options)
  if (app instanceof Router) {
    app[method](fullPath, boundAction)
  } else {
    app[method](fullPath, boundAction)
  }
}

function bindAction(Controller: ControllerConstructor<any>, action: Action, middleware: Middleware[], options: MountOptions) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const controller = options.factory != null
      ? options.factory(Controller, request, response)
      :  new Controller(request, response)

    const method = controller[action.name]
    try {
      if (middleware.length > 0) {
        await callMiddlewareChain(middleware, action.name, request, response)
      }

      const params = convertParams(action, request.params)
      await method.call(controller, ...params)
      response.end()
    } catch (error: any) {
      next(wrapInHTTPError(error, action))
    }
  }
}

function convertParams(action: Action, params: Record<string, any>) {
  return Object.entries(params).map(([name, value]) => {
    const converter = action.paramConverters[name]
    if (converter == null) {
      return value
    } else if (converter === 'integer') {
      return parseInt(value, 0)
    } else if (converter === 'boolean') {
      return (value === 'false' || value === '0') ? false : !!value
    } else {
      return converter(value)
    }
  })
}

function wrapInHTTPError(error: Error, action: Action): HTTPError {
  if (error instanceof HTTPError) {
    // No need to wrap.
    return error
  }

  for (const handler of action.errorHandlers) {
    if (error instanceof handler.ErrorClass) {
      const httpError = HTTPError.createFromError(error, handler.defaultStatus)
      if (handler.toJSON != null) {
        Object.assign(httpError.extra, handler.toJSON(error))
      }
      return httpError
    }
  }

  // No handler, wrap in generic 500 error.
  return HTTPError.createFromError(error, 500)
}

function callMiddlewareChain(middleware: Middleware[], action: string, request: Request, response: Response) {
  const todo = [...middleware]

  return new Promise<void>((resolve, reject) => {
    const nextHandler: NextFunction = (error: Error | 'router' | 'route' | null = null) => {
      if (error instanceof Error) {
        return reject(error)
      }

      const middleware = todo.shift()
      if (middleware == null) {
        resolve()
        return
      }

      const {func, options: {except, only}} = middleware

      if (except != null && except.includes(action)) {
        nextHandler()
        return
      }
      if (only != null && !only.includes(action)) {
        nextHandler()
        return
      }

      func(request, response, nextHandler)
    }

    nextHandler()
  })
}