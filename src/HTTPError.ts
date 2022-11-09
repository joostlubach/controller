import { isFunction } from 'lodash'
export default class HTTPError extends Error {

  constructor(
    public readonly status: number,
    message: string,
    public readonly extra: any = {},
    public readonly underlyingError: Error | null = null
  ) {
    super(message)

    Object.setPrototypeOf(this, HTTPError.prototype)
  }

  public static createFromError(error: Error, defaultStatus: number) {
    const status = (error as any).status ?? defaultStatus
    const json   = isFunction((error as any).toJSON) ? (error as any).toJSON() : {}

    return new HTTPError(status, error.message, json, error)
  }

  public toJSON(verbose: boolean) {
    const json = {
      status:  this.status,
      message: this.message,
      ...this.extra,
    }

    if (verbose && this.underlyingError?.stack != null) {
      json.stack = cleanStack(this.underlyingError.stack)
    }

    return json
  }

}

function cleanStack(stack: string) {
  return stack
    .split('\n')
    .slice(1)
    .map(line => line.trim().replace(/^at\s*/, ''))
}