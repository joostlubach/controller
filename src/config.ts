/* eslint-disable no-console */

import { isFunction } from 'ytil'

export interface Config {
  logger: Logger
}

export interface Logger {
  debug: (message: string, ...meta: any[]) => void
  info:  (message: string, ...meta: any[]) => void
  warn:  (message: string, ...meta: any[]) => void
  error: (message: string, ...meta: any[]) => void
}

const config: Config = {
  logger: {
    debug: console.log,
    info:  console.log,
    warn:  console.warn,
    error: console.error,
  },
}
export default config

export function configure(cfg: Partial<Config> | ((config: Config) => void)) {
  if (isFunction(cfg)) {
    cfg(config)
  } else {
    Object.assign(config, cfg)
  }
}
