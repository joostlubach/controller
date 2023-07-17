export default class HTTPError extends Error {
    readonly status: number;
    readonly extra: any;
    readonly underlyingError: Error | null;
    constructor(status: number, message: string, extra?: any, underlyingError?: Error | null);
    static createFromError(error: Error, defaultStatus: number): HTTPError;
    toJSON(verbose: boolean): any;
}
