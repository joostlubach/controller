import { isFunction } from 'lodash'

export default class HTTPError extends Error {

  constructor(
    public readonly status: number,
    message: string,
    public readonly extra: any = {},
    public readonly cause: Error | null = null,
  ) {
    super(message, {cause})

    Object.setPrototypeOf(this, HTTPError.prototype)
    Error.captureStackTrace(this, HTTPError)
  }

  public static createFromError(error: Error, defaultStatus: number) {
    const status = (error as any).status ?? defaultStatus
    const json = isFunction((error as any).toJSON) ? (error as any).toJSON() : {}

    return new HTTPError(status, error.message, json, error)
  }

  public toJSON(verbose: boolean) {
    const json = {
      status:  this.status,
      message: this.message,
      ...this.extra,
    }

    if (verbose && this.cause?.stack != null) {
      json.stack = cleanStack(this.cause.stack)
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
