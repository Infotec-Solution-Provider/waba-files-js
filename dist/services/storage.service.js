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
const promises_1 = require("node:fs/promises");
const convertBuferToMp3_1 = __importDefault(require("../utils/convertBuferToMp3"));
const getRandomFilename_1 = __importDefault(require("../utils/getRandomFilename"));
const node_path_1 = require("node:path");
const getOriginalFilename_1 = __importDefault(require("../utils/getOriginalFilename"));
const mime_1 = __importDefault(require("mime"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class StorageService {
    constructor() {
        this.filesPath = process.env["FILES_PATH"] || "C:/wa_files";
    }
    /**
     * Saves the provided file to the storage.
     *
     * If the file is an audio file, it converts the buffer to MP3 format,
     * updates the mimetype to "audio/mpeg", and changes the file extension to ".mp3".
     *
     * @param {Buffer} buffer - The buffer of the file to be saved.
     * @param {string} mimeType - The MIME type of the file.
     * @param {string} originalname - The original name of the file.
     * @returns {Promise<string>} - A promise that resolves to the name of the saved file.
     */
    saveFile(buffer, mimeType, originalname) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mimeType.includes("audio")) {
                buffer = yield (0, convertBuferToMp3_1.default)(buffer);
                mimeType = "audio/mpeg";
                originalname = originalname.replace(/\.[^/.]+$/, ".mp3");
            }
            const saveFilename = (0, getRandomFilename_1.default)(originalname);
            const savePath = (0, node_path_1.join)(this.filesPath, saveFilename);
            yield (0, promises_1.writeFile)(savePath, buffer);
            return saveFilename;
        });
    }
    /**
     * Retrieves a file from the storage.
     *
     * @param filename - The name of the file to retrieve.
     * @returns A promise that resolves to an File.
     */
    getFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = (0, node_path_1.join)(this.filesPath, filename);
            const buffer = yield (0, promises_1.readFile)(filePath);
            const originalname = (0, getOriginalFilename_1.default)(filename);
            const mimetype = mime_1.default.getType(filePath) || "";
            const file = new File([buffer], originalname, { type: mimetype });
            return file;
        });
    }
}
exports.default = new StorageService();
