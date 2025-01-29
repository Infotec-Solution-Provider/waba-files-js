"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Log {
    static info(message) {
        console.log(`${new Date().toLocaleString()} [INFO] ${message}`);
    }
    static error(error, message) {
        console.log(`${new Date().toLocaleString()} [ERROR] ${message}`);
        if (process.env["DEBUG_MODE"] == "TRUE") {
            console.error(error);
        }
    }
    static debug(message) {
        if (process.env["DEBUG_MODE"] == "TRUE") {
            console.log(`${new Date().toLocaleString()} [DEBUG] ${message}`);
        }
    }
}
exports.default = Log;
//# sourceMappingURL=log.js.map