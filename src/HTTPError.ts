import { ToJSONOptions } from 'json-error'
import { isFunction } from 'ytil'

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

  public toJSON(options: ToJSONOptions<HTTPError> = {}) {
    const json = {
      status:  this.status,
      message: this.message,
      ...this.extra,
    }

    const {
      mask = 'auto',
      maskForError = isClientError,
    } = options

    const shouldMask = mask === 'always' ? true : mask === 'never' ? false : maskForError(this)

    if (!shouldMask) {
      if (this.cause?.stack != null) {
        json.stack = parseStack(this.cause.stack)
      } else {
        json.stack = parseStack(this.stack)
      }
    }

    return json
  }

}

export function isClientError(error: HTTPError) {
  return error.status < 500
}

export function isServerError(error: HTTPError) {
  return error.status > 500
}

function parseStack(stack: string | undefined) {
  if (stack == null) { return }

  return stack
    .split('\n')
    .slice(1)
    .map(line => line.trim().replace(/^at\s*/, ''))
}
