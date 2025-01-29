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
}
exports.default = Log;
//# sourceMappingURL=log.js.map