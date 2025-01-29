"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:fs/promises");
const convertBuferToMp3_1 = __importDefault(require("../utils/convertBuferToMp3"));
const getRandomFilename_1 = __importDefault(require("../utils/getRandomFilename"));
const node_path_1 = require("node:path");
const getOriginalFilename_1 = __importDefault(require("../utils/getOriginalFilename"));
const mime_1 = __importDefault(require("mime"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class StorageService {
    filesPath = process.env["FILES_PATH"] || "C:/wa_files";
    async saveFile(buffer, mimeType, originalname) {
        if (mimeType.includes("audio")) {
            buffer = await (0, convertBuferToMp3_1.default)(buffer);
            mimeType = "audio/mpeg";
            originalname = originalname.replace(/\.[^/.]+$/, ".mp3");
        }
        const saveFilename = (0, getRandomFilename_1.default)(originalname);
        const savePath = (0, node_path_1.join)(this.filesPath, saveFilename);
        await (0, promises_1.writeFile)(savePath, buffer);
        return saveFilename;
    }
    async getFile(filename) {
        const filePath = (0, node_path_1.join)(this.filesPath, filename);
        const buffer = await (0, promises_1.readFile)(filePath);
        const originalname = (0, getOriginalFilename_1.default)(filename);
        const mimetype = mime_1.default.getType(filePath) || "";
        const file = new File([buffer], originalname, { type: mimetype });
        return file;
    }
}
exports.default = new StorageService();
//# sourceMappingURL=storage.service.js.map