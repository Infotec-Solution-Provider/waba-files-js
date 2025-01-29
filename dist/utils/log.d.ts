export default class Log {
    static info(message: string): void;
    static error(error: any, message: string): void;
    static debug(message: string): void;
}
