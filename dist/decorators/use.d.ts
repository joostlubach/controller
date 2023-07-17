import { MiddlewareFunction, MiddlewareOptions } from '../types';
export declare function use(func: MiddlewareFunction, options?: MiddlewareOptions): (target: any) => void;
