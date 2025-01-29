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
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const api_service_1 = __importDefault(require("../services/api.service"));
const log_1 = __importDefault(require("../utils/log"));
class ApiController {
    constructor(apiService) {
        this.router = (0, express_1.Router)();
        this.upload = (0, multer_1.default)();
        this.apiService = apiService;
        this.router.post("", this.upload.single("file"), this.handleUploadFile);
        this.router.get("/:filename", this.handleDownloadFile);
        this.router.post("/waba-file", this.handleGetWABAFile);
        this.router.post("/convert-to-mp3", this.upload.single("file"), this.handleGetAudioWABAMediaId);
        this.router.post("media-id/:filename", this.handleGetWABAMediaId);
    }
    handleUploadFile(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    res.status(400).send("No file uploaded.");
                }
                else {
                    const savedFilename = yield this.apiService.saveFileToLocalStorage(req.file);
                    log_1.default.info(`Upload de arquivo bem sucedido: ${req.file.originalname}`);
                    res.status(200).json({ filename: savedFilename });
                }
            }
            catch (err) {
                log_1.default.error(err, `Falha no upload do arquivo: ${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`);
                res.status(500).json({ message: `Falha no upload do arquivo: ${(_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname}`, cause: err });
            }
        });
    }
    handleDownloadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params["filename"]) {
                    res.status(400).send("No filename provided.");
                }
                else {
                    const file = yield this.apiService.getFileFromLocalStorage(req.params["filename"]);
                    res.status(200).send(file);
                }
            }
            catch (err) {
                log_1.default.error(err, `Falha no download do arquivo: ${req.params["filename"]}`);
                res.status(500).json({ message: `Falha no download do arquivo: ${req.params["filename"]}`, cause: err });
            }
        });
    }
    handleGetWABAFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url, originalname } = req.body;
                const filename = yield this.apiService.getFileFromWABAUrl(url, originalname);
                res.status(200).json({ filename });
            }
            catch (err) {
                log_1.default.error(err, `Falha ao obter arquivo WABA: ${req.body.originalname}`);
                res.status(500).json({ message: `Falha ao obter arquivo WABA: ${req.body.originalname}`, cause: err });
            }
        });
    }
    handleGetWABAMediaId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params["filename"]) {
                    res.status(400).send("No filename provided.");
                }
                else {
                    const mediaId = yield this.apiService.uploadFileToWABA(req.params["filename"]);
                    res.status(200).json(mediaId);
                }
            }
            catch (err) {
                log_1.default.error(err, `Falha ao obter media ID WABA: ${req.params["filename"]}`);
                res.status(500).json({ message: `Falha ao obter media ID WABA: ${req.params["filename"]}`, cause: err });
            }
        });
    }
    handleGetAudioWABAMediaId(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    res.status(400).send("No file uploaded.");
                }
                else {
                    const filename = yield this.apiService.saveFileToLocalStorage(req.file);
                    const mediaId = yield this.apiService.uploadFileToWABA(filename);
                    res.status(200).send(mediaId);
                }
            }
            catch (err) {
                log_1.default.error(err, `Falha ao obter media ID de áudio WABA: ${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`);
                res.status(500).json({ message: `Falha ao obter media ID de áudio WABA: ${(_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname}`, cause: err });
            }
        });
    }
}
exports.default = new ApiController(api_service_1.default);
