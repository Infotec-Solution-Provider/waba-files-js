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
    constructor() {
        this.router.post("", this.upload.single("file"), this.handleUploadFile);
        this.router.get("/:filename", this.handleDownloadFile);
        this.router.post("/waba-file", this.handleGetWABAFile);
        this.router.post("/convert-to-mp3", this.upload.single("file"), this.handleGetAudioWABAMediaId);
        this.router.post("/media-id/:filename", () => console.log("foi"), this.handleGetWABAMediaId);
    }
    async handleUploadFile(req, res) {
        try {
            if (!req.file) {
                res.status(400).send("No file uploaded.");
            }
            else {
                const savedFilename = await api_service_1.default.saveFileToLocalStorage(req.file);
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
                const file = await api_service_1.default.getFileFromLocalStorage(req.params["filename"]);
                res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);
                res.contentType(file.type);
                res.send(file.buffer);
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
            const filename = await api_service_1.default.getFileFromWABAUrl(url, originalname);
            res.status(200).json({ filename });
        }
        catch (err) {
            log_1.default.error(err, `Falha ao obter arquivo WABA: ${req.body.originalname}`);
            res.status(500).json({ message: `Falha ao obter arquivo WABA: ${req.body.originalname}`, cause: err });
        }
    }
    async handleGetWABAMediaId(req, res) {
        try {
            log_1.default.debug(`Iniciando handleGetWABAMediaId com filename: ${req.params["filename"]}`);
            if (!req.params["filename"]) {
                res.status(400).send("No filename provided.");
            }
            else {
                const mediaId = await api_service_1.default.uploadFileToWABA(req.params["filename"]);
                log_1.default.debug(`Media ID obtido com sucesso: ${mediaId}`);
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
                const filename = await api_service_1.default.saveFileToLocalStorage(req.file);
                const mediaId = await api_service_1.default.uploadFileToWABA(filename);
                res.status(200).send(mediaId);
            }
        }
        catch (err) {
            log_1.default.error(err, `Falha ao obter media ID de áudio WABA: ${req.file?.originalname}`);
            res.status(500).json({ message: `Falha ao obter media ID de áudio WABA: ${req.file?.originalname}`, cause: err });
        }
    }
}
const apiController = new ApiController();
exports.default = apiController;
//# sourceMappingURL=api.controller.js.map