import { Constructor } from '../types';
export declare function handle<E extends Error>(ErrorClass: Constructor<E>, defaultStatus: number, toJSON?: (error: E) => any): (...args: any[]) => void;
