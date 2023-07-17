import { ControllerConstructor, Action, Middleware, ErrorHandler } from './types';
export interface RegistryEntry {
    bases?: string[];
    actions: Action[];
    middleware: Middleware[];
    errorHandlers: ErrorHandler[];
}
declare const _default: {
    get(controller: ControllerConstructor): RegistryEntry;
};
export default _default;
