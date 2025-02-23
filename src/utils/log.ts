export default class Log {
    public static info(message: string) {
        console.log(`${new Date().toLocaleString()} [INFO] ${message}`);
    }

    public static error(error: any, message: string) {
        console.log(`${new Date().toLocaleString()} [ERROR] ${message}`);

        if (process.env["DEBUG_MODE"] == "TRUE") {
            console.error(error);
        }
    }

    public static debug(message: string, data?: any) {
        if (process.env["DEBUG_MODE"] == "TRUE") {
            data ?
                console.log(`${new Date().toLocaleString()} [DEBUG] ${message} | Data: `, data) : 
                console.log(`${new Date().toLocaleString()} [DEBUG] ${message}`);
        }
    }
}