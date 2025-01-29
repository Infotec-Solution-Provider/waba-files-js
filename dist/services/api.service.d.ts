/// <reference types="multer" />
import File from "../entities/file";
declare class ApiService {
    private readonly storageService;
    private readonly wabaService;
    saveFileToLocalStorage(file: Express.Multer.File): Promise<string>;
    getFileFromLocalStorage(filename: string): Promise<File>;
    getFileFromWABAUrl(url: string, originalname: string): Promise<string>;
    uploadFileToWABA(filename: string): Promise<{
        id: string;
    }>;
}
declare const apiService: ApiService;
export default apiService;
