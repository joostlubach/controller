import { Request, Response, NextFunction } from 'express';
export type Constructor<T> = new (...args: any[]) => T;
export type ControllerConstructor = (new (request: Request, response: Response) => any) | (new () => any);
export interface Action {
    name: string;
    path: string;
    method: Method;
    paramConverters: ParamConverterMap;
    errorHandlers: ErrorHandler[];
}
export type ParamConverterMap<T = any> = Record<string, 'integer' | 'boolean' | ((raw: string) => T)>;
export interface ErrorHandler<E extends Error = any> {
    ErrorClass: Constructor<E>;
    defaultStatus: number;
    toJSON?: (error: E) => any;
}
export interface Middleware {
    func: MiddlewareFunction;
    options: MiddlewareOptions;
}
export type MiddlewareFunction = (request: Request, response: Response, next: NextFunction) => void | Promise<void>;
export interface MiddlewareOptions {
    except?: string[];
    only?: string[];
}
export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
