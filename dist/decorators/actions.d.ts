import { ParamConverterMap } from '../types';
export declare const get: (path: string, paramConverters?: ParamConverterMap) => (target: any, key: string) => void;
export declare const post: (path: string, paramConverters?: ParamConverterMap) => (target: any, key: string) => void;
export declare const put: (path: string, paramConverters?: ParamConverterMap) => (target: any, key: string) => void;
export declare const patch: (path: string, paramConverters?: ParamConverterMap) => (target: any, key: string) => void;
export declare const del: (path: string, paramConverters?: ParamConverterMap) => (target: any, key: string) => void;
