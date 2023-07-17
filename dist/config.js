/* eslint-disable no-console */
import { isFunction } from 'lodash';
const config = {
    logger: {
        debug: console.log,
        info: console.log,
        warn: console.warn,
        error: console.error,
    },
};
export default config;
export function configure(cfg) {
    if (isFunction(cfg)) {
        cfg(config);
    }
    else {
        Object.assign(config, cfg);
    }
}
