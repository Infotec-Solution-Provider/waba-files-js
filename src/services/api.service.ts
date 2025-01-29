import File from "../entities/file";
import storageService from "./storage.service";
import WABAService from "./waba.service";

class ApiService {
    private readonly storageService = storageService;
    private readonly wabaService = WABAService;

    /**
     * Saves the provided file to local storage.
     *
     * @param {Express.Multer.File} file - The file to be saved, provided by Multer.
     * @returns {Promise<string>} A promise that resolves to the saved filename.
     */
    public async saveFileToLocalStorage(file: Express.Multer.File): Promise<string> {
        const savedFilename = await this.storageService.saveFile(file.buffer, file.mimetype, file.originalname);

        return savedFilename;
    }

    /**
     * Retrieves a file from local storage.
     *
     * @param {string} filename - The name of the file to retrieve.
     * @returns {Promise<File>} A promise that resolves to the retrieved file.
     */
    public async getFileFromLocalStorage(filename: string): Promise<File> {
        const file = await this.storageService.getFile(filename);

        return file;
    }

    public async getFileFromWABAUrl(url: string, originalname: string): Promise<string> {
        const file = await this.wabaService.downloadWABAFile(url, originalname);
        const savedFilename = await this.storageService.saveFile(file.buffer, file.type, file.name);

        return savedFilename;
    }

    public async uploadFileToWABA(filename: string): Promise<{ id: string }> {
        const file = await this.storageService.getFile(filename);
        const response = await this.wabaService.uploadWABAFile(file);

        return response;
    }
}

const apiService = new ApiService();
export default apiService;