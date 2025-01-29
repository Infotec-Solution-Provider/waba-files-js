"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const dotenv_1 = require("dotenv");
const file_1 = __importDefault(require("../entities/file"));
(0, dotenv_1.config)();
class WABAService {
    WABAToken = process.env["WABA_TOKEN"];
    WABANumberId = process.env["WABA_NUMBER_ID"];
    async downloadWABAFile(url, originalname) {
        const headers = { 'Authorization': `Bearer ${this.WABAToken}` };
        const responseType = 'arraybuffer';
        const response = await axios_1.default.get(url, { headers, responseType });
        if (response.status !== 200) {
            throw new Error("Error while downloading file. Status: " + response.status);
        }
        const contentType = response.headers['content-type'];
        const file = new file_1.default(Buffer.from(response.data), originalname, contentType);
        return file;
    }
    async uploadWABAFile(file) {
        const requestUrl = `https://graph.facebook.com/v16.0/${this.WABANumberId}/media`;
        const formData = new form_data_1.default();
        formData.append("file", file.buffer, file.name);
        formData.append("type", file.type);
        formData.append("messaging_product", "whatsapp");
        const headers = { 'Authorization': `Bearer ${this.WABAToken}`, ...formData.getHeaders() };
        const mediaIdResponse = await axios_1.default.post(requestUrl, formData, { headers });
        return { ...mediaIdResponse.data, mimeType: file.type };
    }
}
exports.default = new WABAService();
//# sourceMappingURL=waba.service.js.map