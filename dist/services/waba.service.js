"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class WABAService {
    constructor() {
        this.WABAToken = process.env["WABA_TOKEN"];
        this.WABANumberId = process.env["WABA_NUMBER_ID"];
    }
    /**
     * Downloads a file from the given URL and returns it as a `File` object.
     *
     * @param url - The URL from which to download the file.
     * @param originalname - The original name of the file to be used when creating the `File` object.
     * @returns A promise that resolves to a `File` object containing the downloaded data.
     * @throws Will throw an error if the download fails or the response status is not 200.
     */
    downloadWABAFile(url, originalname) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = { 'Authorization': `Bearer ${this.WABAToken}` };
            const responseType = 'arraybuffer';
            const response = yield axios_1.default.get(url, { headers, responseType });
            if (response.status !== 200) {
                throw new Error("Error while downloading file. Status: " + response.status);
            }
            const contentType = response.headers['content-type'];
            const file = new File([response.data], originalname, { type: contentType });
            return file;
        });
    }
    uploadWABAFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestUrl = `https://graph.facebook.com/v16.0/${this.WABANumberId}/media`;
            const formData = new form_data_1.default();
            const fileBlob = new Blob([yield file.arrayBuffer()], { type: file.type });
            formData.append("file", fileBlob, file.name);
            formData.append("type", file.type);
            formData.append("messaging_product", "whatsapp");
            const headers = Object.assign({ 'Authorization': `Bearer ${this.WABAToken}` }, formData.getHeaders());
            const response = yield axios_1.default.post(requestUrl, formData, { headers });
            return response.data;
        });
    }
}
exports.default = new WABAService();
