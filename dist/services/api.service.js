"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_service_1 = __importDefault(require("./storage.service"));
const waba_service_1 = __importDefault(require("./waba.service"));
class ApiService {
    storageService = storage_service_1.default;
    wabaService = waba_service_1.default;
    async saveFileToLocalStorage(file) {
        const savedFilename = await this.storageService.saveFile(file.buffer, file.mimetype, file.originalname);
        return savedFilename;
    }
    async getFileFromLocalStorage(filename) {
        const file = await this.storageService.getFile(filename);
        return file;
    }
    async getFileFromWABAUrl(url, originalname) {
        const file = await this.wabaService.downloadWABAFile(url, originalname);
        const buffer = Buffer.from(await file.arrayBuffer());
        const savedFilename = await this.storageService.saveFile(buffer, file.type, file.name);
        return savedFilename;
    }
    async uploadFileToWABA(filename) {
        const file = await this.storageService.getFile(filename);
        const response = await this.wabaService.uploadWABAFile(file);
        return response;
    }
}
const apiService = new ApiService();
exports.default = apiService;
//# sourceMappingURL=api.service.js.map