"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_controller_1 = __importDefault(require("./controllers/api.controller"));
const log_1 = __importDefault(require("./utils/log"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(api_controller_1.default.router);
app.listen(Number(process.env["APP_PORT"] || "7001"), () => {
    log_1.default.info(`Server is running on port ${process.env["APP_PORT"] || "7001"}`);
});
//# sourceMappingURL=app.js.map