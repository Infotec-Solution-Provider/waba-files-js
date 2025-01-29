import { readFile, writeFile } from "node:fs/promises";
import convertBufferToMp3 from "../utils/convertBuferToMp3";
import getRandomFilename from "../utils/getRandomFilename";
import { join } from "node:path";
import getOriginalFilename from "../utils/getOriginalFilename";
import mime from "mime";

class StorageService {
    private readonly filesPath: string = process.env.FILES_PATH || "C:/wa_files";

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
    public async saveFile(buffer: Buffer, mimeType: string, originalname: string): Promise<string> {
        if (mimeType.includes("audio")) {
            buffer = await convertBufferToMp3(buffer);
            mimeType = "audio/mpeg";
            originalname = originalname.replace(/\.[^/.]+$/, ".mp3");
        }

        const saveFilename = getRandomFilename(originalname);
        const savePath = join(this.filesPath, saveFilename);

        await writeFile(savePath, buffer);

        return saveFilename;
    }

    /**
     * Retrieves a file from the storage.
     *
     * @param filename - The name of the file to retrieve.
     * @returns A promise that resolves to an File.
     */
    public async getFile(filename: string): Promise<File> {
        const filePath = join(this.filesPath, filename);
        const buffer = await readFile(filePath);
        const originalname = getOriginalFilename(filename);
        const mimetype = mime.getType(filePath) || "";

        const file = new File([buffer], originalname, { type: mimetype });

        return file;
    }
}

export default new StorageService();