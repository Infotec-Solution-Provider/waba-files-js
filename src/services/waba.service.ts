import axios from "axios";
import FormData from "form-data";
import { config } from "dotenv";
import File from "../entities/file";

config();

class WABAService {
    private readonly WABAToken = process.env["WABA_TOKEN"];
    private readonly WABANumberId = process.env["WABA_NUMBER_ID"];

    private toErrorMessage(error: unknown): string {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const responseData = error.response?.data;
            const responseDetails = typeof responseData === "string"
                ? responseData
                : JSON.stringify(responseData);

            return `Axios error${status ? ` (status ${status})` : ""}: ${responseDetails || error.message}`;
        }

        if (error instanceof Error) {
            return error.message;
        }

        return String(error);
    }

    /**
     * Downloads a file from the given URL and returns it as a `File` object.
     *
     * @param url - The URL from which to download the file.
     * @param originalname - The original name of the file to be used when creating the `File` object.
     * @returns A promise that resolves to a `File` object containing the downloaded data.
     * @throws Will throw an error if the download fails or the response status is not 200.
     */
    public async downloadWABAFile(url: string, originalname: string): Promise<File> {
        if (!this.WABAToken) {
            throw new Error("WABA_TOKEN is not configured");
        }

        if (!url) {
            throw new Error("URL is required to download WABA file");
        }

        const headers = { 'Authorization': `Bearer ${this.WABAToken}` };
        const responseType = 'arraybuffer';

        let response;
        try {
            response = await axios.get(url, { headers, responseType });
        } catch (error) {
            throw new Error(`Error while downloading WABA file: ${this.toErrorMessage(error)}`);
        }

        if (response.status !== 200) {
            throw new Error("Error while downloading file. Status: " + response.status);
        }

        const contentType = response.headers['content-type'];
        const file = new File(Buffer.from(response.data), originalname, contentType);

        return file;
    }

    public async uploadWABAFile(file: File): Promise<{ id: string }> {
        if (!this.WABAToken) {
            throw new Error("WABA_TOKEN is not configured");
        }

        if (!this.WABANumberId) {
            throw new Error("WABA_NUMBER_ID is not configured");
        }

        const requestUrl = `https://graph.facebook.com/v16.0/${this.WABANumberId}/media`;
        const formData = new FormData();

        formData.append("file", file.buffer, file.name);
        formData.append("type", file.type);
        formData.append("messaging_product", "whatsapp");

        const headers = { 'Authorization': `Bearer ${this.WABAToken}`, ...formData.getHeaders() };

        let mediaIdResponse;
        try {
            mediaIdResponse = await axios.post(requestUrl, formData, { headers });
        } catch (error) {
            throw new Error(`Error while uploading WABA file: ${this.toErrorMessage(error)}`);
        }

        return { ...mediaIdResponse.data, mimeType: file.type };
    }
}

export default new WABAService();