import { readFile, writeFile } from "node:fs/promises";
import convertBufferToMp3 from "../utils/convertBuferToMp3";
import getRandomFilename from "../utils/getRandomFilename";
import { join } from "node:path";
import getOriginalFilename from "../utils/getOriginalFilename";
import mime from "mime-types";
import { config } from "dotenv";
import File from "../entities/file";
import Log from "../utils/log";

config();

class StorageService {
    private readonly filesPath: string = process.env["FILES_PATH"] || "C:/wa_files";

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
        Log.debug(`saveFile iniciado: originalname=${originalname || "(vazio)"}, mimeType=${mimeType || "(vazio)"}, filesPath=${this.filesPath}`);

        if (mimeType.includes("audio")) {
            Log.debug(`saveFile convertendo audio para mp3: originalname=${originalname || "(vazio)"}`);
            buffer = await convertBufferToMp3(buffer);
            mimeType = "audio/mpeg";
            originalname = (originalname || "file").replace(/\.[^/.]+$/, ".mp3");
        }

        const saveFilename = getRandomFilename(originalname || "file");
        const savePath = join(this.filesPath, saveFilename);

        Log.debug(`saveFile caminho resolvido: saveFilename=${saveFilename}, savePath=${savePath}`);

        await writeFile(savePath, buffer);

        Log.debug(`saveFile concluido com sucesso: savePath=${savePath}`);

        return saveFilename;
    }

    /**
     * Retrieves a file from the storage.
     *
     * @param filename - The name of the file to retrieve.
     * @returns A promise that resolves to an File.
     */
    public async getFile(filename: string): Promise<File> {
        Log.debug(`getFile iniciado: filename=${filename || "(vazio)"}, filesPath=${this.filesPath}`);

        const filePath = join(this.filesPath, filename);
        Log.debug(`getFile caminho resolvido: filePath=${filePath}`);

        try {
            const buffer = await readFile(filePath);
            const originalname = getOriginalFilename(filename);
            const mimetype = mime.lookup(filePath) || "";

            Log.debug(`getFile metadados encontrados: originalname=${originalname || "(vazio)"}, mimetype=${mimetype || "(vazio)"}, bytes=${buffer.length}`);

            const file = new File(buffer, originalname, mimetype);

            return file;
        } catch (error) {
            const errorCode = typeof error === "object" && error !== null && "code" in error ? (error as { code?: string }).code : undefined;
            Log.error(error, `getFile falhou: filename=${filename}, filePath=${filePath}, errorCode=${errorCode || "(desconhecido)"}`);

            throw new Error(`Nao foi possivel localizar o arquivo: filename=${filename}, filePath=${filePath}${errorCode ? `, errorCode=${errorCode}` : ""}`);
        }
    }
}

export default new StorageService();