"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_service_1 = __importDefault(require("./storage.service"));
const waba_service_1 = __importDefault(require("./waba.service"));
class ApiService {
    constructor(storageService, wabaService) {
        this.storageService = storageService;
        this.wabaService = wabaService;
    }
    /**
     * Saves the provided file to local storage.
     *
     * @param {Express.Multer.File} file - The file to be saved, provided by Multer.
     * @returns {Promise<string>} A promise that resolves to the saved filename.
     */
    saveFileToLocalStorage(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedFilename = yield this.storageService.saveFile(file.buffer, file.mimetype, file.originalname);
            return savedFilename;
        });
    }
    /**
     * Retrieves a file from local storage.
     *
     * @param {string} filename - The name of the file to retrieve.
     * @returns {Promise<File>} A promise that resolves to the retrieved file.
     */
    getFileFromLocalStorage(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.storageService.getFile(filename);
            return file;
        });
    }
    getFileFromWABAUrl(url, originalname) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.wabaService.downloadWABAFile(url, originalname);
            const buffer = Buffer.from(yield file.arrayBuffer());
            const savedFilename = yield this.storageService.saveFile(buffer, file.type, file.name);
            return savedFilename;
        });
    }
    uploadFileToWABA(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.storageService.getFile(filename);
            const response = yield this.wabaService.uploadWABAFile(file);
            return response;
        });
    }
}
exports.default = new ApiService(storage_service_1.default, waba_service_1.default);
