import { isFunction } from 'lodash';
export default class HTTPError extends Error {
    status;
    extra;
    underlyingError;
    constructor(status, message, extra = {}, underlyingError = null) {
        super(message);
        this.status = status;
        this.extra = extra;
        this.underlyingError = underlyingError;
        Object.setPrototypeOf(this, HTTPError.prototype);
    }
    static createFromError(error, defaultStatus) {
        const status = error.status ?? defaultStatus;
        const json = isFunction(error.toJSON) ? error.toJSON() : {};
        return new HTTPError(status, error.message, json, error);
    }
    toJSON(verbose) {
        const json = {
            status: this.status,
            message: this.message,
            ...this.extra,
        };
        if (verbose && this.underlyingError?.stack != null) {
            json.stack = cleanStack(this.underlyingError.stack);
        }
        return json;
    }
}
function cleanStack(stack) {
    return stack
        .split('\n')
        .slice(1)
        .map(line => line.trim().replace(/^at\s*/, ''));
}
