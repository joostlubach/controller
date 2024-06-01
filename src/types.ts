import { NextFunction, Request, Response } from 'express'
import { Constructor } from 'ytil'

export interface MountOptions {

  /**
   * A factory function that will be used to create controller instances. If not specified, your constructors must accept
   * a `Request` and `Response` as their only two arguments.
   */
  factory?: ControllerFactory<any, any[]>

}

export type ControllerConstructor<C, A extends any[] = []> = StatefulControllerConstructor<C, A> | StatelessControllerConstructor<C, A>
export type StatefulControllerConstructor<C, A extends any[] = []> = Constructor<C, [...A, Request, Response]>
export type StatelessControllerConstructor<C, A extends any[] = []> = Constructor<C, [...A]>

export type ControllerFactory<C, A extends any[]> = (Controller: ControllerConstructor<C, A>, request: Request, response: Response) => C

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

export interface Middleware<C> {
  func:    MiddlewareFunction<C>
  options: MiddlewareOptions
}

export type MiddlewareFunction<C> = (
  controller: C,
  request: Request,
  response: Response,
  next: NextFunction
) => void | Promise<void>

export interface MiddlewareOptions {
  except?: string[]
  only?:   string[]
}

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'
