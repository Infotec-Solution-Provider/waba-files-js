"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const api_service_1 = __importDefault(require("../services/api.service"));
const log_1 = __importDefault(require("../utils/log"));
class ApiController {
    router = (0, express_1.Router)();
    upload = (0, multer_1.default)();
    apiService = api_service_1.default;
    constructor() {
        this.router.post("", this.upload.single("file"), this.handleUploadFile);
        this.router.get("/:filename", this.handleDownloadFile);
        this.router.post("/waba-file", this.handleGetWABAFile);
        this.router.post("/convert-to-mp3", this.upload.single("file"), this.handleGetAudioWABAMediaId);
        this.router.post("media-id/:filename", this.handleGetWABAMediaId);
    }
    async handleUploadFile(req, res) {
        try {
            if (!req.file) {
                res.status(400).send("No file uploaded.");
            }
            else {
                const savedFilename = await this.apiService.saveFileToLocalStorage(req.file);
                log_1.default.info(`Upload de arquivo bem sucedido: ${req.file.originalname}`);
                res.status(200).json({ filename: savedFilename });
            }
        }
        catch (err) {
            log_1.default.error(err, `Falha no upload do arquivo: ${req.file?.originalname}`);
            res.status(500).json({ message: `Falha no upload do arquivo: ${req.file?.originalname}`, cause: err });
        }
    }
    async handleDownloadFile(req, res) {
        try {
            if (!req.params["filename"]) {
                res.status(400).send("No filename provided.");
            }
            else {
                const file = await this.apiService.getFileFromLocalStorage(req.params["filename"]);
                res.status(200).send(file);
            }
        }
        catch (err) {
            log_1.default.error(err, `Falha no download do arquivo: ${req.params["filename"]}`);
            res.status(500).json({ message: `Falha no download do arquivo: ${req.params["filename"]}`, cause: err });
        }
    }
    async handleGetWABAFile(req, res) {
        try {
            const { url, originalname } = req.body;
            const filename = await this.apiService.getFileFromWABAUrl(url, originalname);
            res.status(200).json({ filename });
        }
        catch (err) {
            log_1.default.error(err, `Falha ao obter arquivo WABA: ${req.body.originalname}`);
            res.status(500).json({ message: `Falha ao obter arquivo WABA: ${req.body.originalname}`, cause: err });
        }
    }
    async handleGetWABAMediaId(req, res) {
        try {
            if (!req.params["filename"]) {
                res.status(400).send("No filename provided.");
            }
            else {
                const mediaId = await this.apiService.uploadFileToWABA(req.params["filename"]);
                res.status(200).json(mediaId);
            }
        }
        catch (err) {
            log_1.default.error(err, `Falha ao obter media ID WABA: ${req.params["filename"]}`);
            res.status(500).json({ message: `Falha ao obter media ID WABA: ${req.params["filename"]}`, cause: err });
        }
    }
    async handleGetAudioWABAMediaId(req, res) {
        try {
            if (!req.file) {
                res.status(400).send("No file uploaded.");
            }
            else {
                const filename = await this.apiService.saveFileToLocalStorage(req.file);
                const mediaId = await this.apiService.uploadFileToWABA(filename);
                res.status(200).send(mediaId);
            }
        }
        catch (err) {
            log_1.default.error(err, `Falha ao obter media ID de áudio WABA: ${req.file?.originalname}`);
            res.status(500).json({ message: `Falha ao obter media ID de áudio WABA: ${req.file?.originalname}`, cause: err });
        }
    }
}
exports.default = new ApiController();
//# sourceMappingURL=api.controller.js.map