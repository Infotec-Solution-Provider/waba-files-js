/// <reference types="multer" />
import StorageService from "./storage.service";
import WABAService from "./waba.service";
declare class ApiService {
    private readonly storageService;
    private readonly wabaService;
    constructor(storageService: typeof StorageService, wabaService: typeof WABAService);
    saveFileToLocalStorage(file: Express.Multer.File): Promise<string>;
    getFileFromLocalStorage(filename: string): Promise<File>;
    getFileFromWABAUrl(url: string, originalname: string): Promise<string>;
    uploadFileToWABA(filename: string): Promise<{
        id: string;
    }>;
}
declare const _default: ApiService;
export default _default;
