import { Request, Response, Router } from "express";
import multer from "multer";
import APIService from "../services/api.service";
import Log from "../utils/log";

class ApiController {
    public readonly router = Router();
    private readonly upload = multer();
    private readonly apiService = APIService;

    constructor() {
        this.router.post("", this.upload.single("file"), this.handleUploadFile);
        this.router.get("/:filename", this.handleDownloadFile);
        this.router.post("/waba-file", this.handleGetWABAFile);
        this.router.post("/convert-to-mp3", this.upload.single("file"), this.handleGetAudioWABAMediaId);
        this.router.post("media-id/:filename", this.handleGetWABAMediaId);

        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleDownloadFile = this.handleDownloadFile.bind(this);
        this.handleGetWABAFile = this.handleGetWABAFile.bind(this);
        this.handleGetWABAMediaId = this.handleGetWABAMediaId.bind(this);
        this.handleGetAudioWABAMediaId = this.handleGetAudioWABAMediaId.bind(this);
    }

    private async handleUploadFile(req: Request, res: Response) {
        try {
            if (!req.file) {
                res.status(400).send("No file uploaded.");
            } else {
                const savedFilename = await this.apiService.saveFileToLocalStorage(req.file);
                Log.info(`Upload de arquivo bem sucedido: ${req.file.originalname}`);

                res.status(200).json({ filename: savedFilename });
            }
        } catch (err) {
            Log.error(err, `Falha no upload do arquivo: ${req.file?.originalname}`);
            res.status(500).json({ message: `Falha no upload do arquivo: ${req.file?.originalname}`, cause: err });
        }
    }

    private async handleDownloadFile(req: Request, res: Response) {
        try {
            if (!req.params["filename"]) {
                res.status(400).send("No filename provided.");
            } else {
                const file = await this.apiService.getFileFromLocalStorage(req.params["filename"]);

                res.status(200).send(file);
            }
        } catch (err) {
            Log.error(err, `Falha no download do arquivo: ${req.params["filename"]}`);
            res.status(500).json({ message: `Falha no download do arquivo: ${req.params["filename"]}`, cause: err });
        }
    }

    private async handleGetWABAFile(req: Request, res: Response) {
        try {
            const { url, originalname } = req.body;
            const filename = await this.apiService.getFileFromWABAUrl(url, originalname);

            res.status(200).json({ filename });
        } catch (err) {
            Log.error(err, `Falha ao obter arquivo WABA: ${req.body.originalname}`);
            res.status(500).json({ message: `Falha ao obter arquivo WABA: ${req.body.originalname}`, cause: err });
        }
    }

    private async handleGetWABAMediaId(req: Request, res: Response) {
        try {
            if (!req.params["filename"]) {
                res.status(400).send("No filename provided.");
            } else {
                const mediaId = await this.apiService.uploadFileToWABA(req.params["filename"]);

                res.status(200).json(mediaId);
            }

        } catch (err) {
            Log.error(err, `Falha ao obter media ID WABA: ${req.params["filename"]}`);
            res.status(500).json({ message: `Falha ao obter media ID WABA: ${req.params["filename"]}`, cause: err });
        }
    }

    private async handleGetAudioWABAMediaId(req: Request, res: Response) {
        try {
            if (!req.file) {
                res.status(400).send("No file uploaded.");
            } else {
                const filename = await this.apiService.saveFileToLocalStorage(req.file);
                const mediaId = await this.apiService.uploadFileToWABA(filename);

                res.status(200).send(mediaId);
            }
        } catch (err) {
            Log.error(err, `Falha ao obter media ID de áudio WABA: ${req.file?.originalname}`);
            res.status(500).json({ message: `Falha ao obter media ID de áudio WABA: ${req.file?.originalname}`, cause: err });
        }
    }
}

export default new ApiController();