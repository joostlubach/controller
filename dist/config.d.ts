export interface Config {
    logger: Logger;
}
export interface Logger {
    debug: (message: string, ...meta: any[]) => void;
    info: (message: string, ...meta: any[]) => void;
    warn: (message: string, ...meta: any[]) => void;
    error: (message: string, ...meta: any[]) => void;
}
declare const config: Config;
export default config;
export declare function configure(cfg: Partial<Config> | ((config: Config) => void)): void;
