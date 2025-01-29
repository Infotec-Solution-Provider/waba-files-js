export default class Log {
    public static info(message: string) {
        console.log(`${new Date().toLocaleString()} [INFO] ${message}`);
    }

    public static error(error: any, message: string) {
        console.log(`${new Date().toLocaleString()} [ERROR] ${message}`);

        if (process.env.DEBUG_MODE == "TRUE") {
            console.error(error);
        }
    }
}