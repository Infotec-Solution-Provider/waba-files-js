/// <reference types="node" />
/// <reference types="node" />
import File from "../entities/file";
declare class StorageService {
    private readonly filesPath;
    saveFile(buffer: Buffer, mimeType: string, originalname: string): Promise<string>;
    getFile(filename: string): Promise<File>;
}
declare const _default: StorageService;
export default _default;
