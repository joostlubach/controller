import { NextFunction, Request, Response } from 'express'
import { Constructor } from 'ytil'

export type ControllerFactory<C>     = (request: Request, response: Response) => C
export type ControllerConstructor<C> = new (request: Request, response: Response) => C

export interface MountOptions {
  factory?: <C>(Controller: ControllerConstructor<C>, request: Request, response: Response) => C
}

export interface Action {
  name:            string
  path:            string
  method:          Method
  paramConverters: ParamConverterMap
  errorHandlers:   ErrorHandler[]
}

export type ParamConverterMap<T = any> = Record<string, 'integer' | 'boolean' | ((raw: string) => T)>

export interface ErrorHandler<E extends Error = any> {
  ErrorClass:    Constructor<E>
  defaultStatus: number
  toJSON?:       (error: E) => any
}

export interface Middleware {
  func:    MiddlewareFunction
  options: MiddlewareOptions
}

export type MiddlewareFunction = (
  request: Request,
  response: Response,
  next: NextFunction
) => void | Promise<void>

export interface MiddlewareOptions {
  except?: string[]
  only?:   string[]
}

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'