import File from "../entities/file";
declare class WABAService {
    private readonly WABAToken;
    private readonly WABANumberId;
    downloadWABAFile(url: string, originalname: string): Promise<File>;
    uploadWABAFile(file: File): Promise<{
        id: string;
    }>;
}
declare const _default: WABAService;
export default _default;
