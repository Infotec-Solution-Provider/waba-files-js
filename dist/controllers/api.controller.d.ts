import { Router } from "express";
import ApiService from "../services/api.service";
declare class ApiController {
    readonly router: Router;
    private readonly upload;
    private readonly apiService;
    constructor(apiService: typeof ApiService);
    private handleUploadFile;
    private handleDownloadFile;
    private handleGetWABAFile;
    private handleGetWABAMediaId;
    private handleGetAudioWABAMediaId;
}
declare const _default: ApiController;
export default _default;
