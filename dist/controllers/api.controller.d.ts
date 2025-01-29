declare class ApiController {
    readonly router: import("express-serve-static-core").Router;
    private readonly upload;
    constructor();
    private handleUploadFile;
    private handleDownloadFile;
    private handleGetWABAFile;
    private handleGetWABAMediaId;
    private handleGetAudioWABAMediaId;
}
declare const apiController: ApiController;
export default apiController;
