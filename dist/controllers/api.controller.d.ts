declare class ApiController {
    readonly router: import("express-serve-static-core").Router;
    private readonly upload;
    private readonly apiService;
    constructor();
    private handleUploadFile;
    private handleDownloadFile;
    private handleGetWABAFile;
    private handleGetWABAMediaId;
    private handleGetAudioWABAMediaId;
}
declare const _default: ApiController;
export default _default;
