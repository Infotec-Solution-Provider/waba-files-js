import axios from "axios";
import FormData from "form-data";
import { config } from "dotenv";
import File from "../entities/file";

config();

class WABAService {
    private readonly WABAToken = process.env["WABA_TOKEN"];
    private readonly WABANumberId = process.env["WABA_NUMBER_ID"];

    /**
     * Downloads a file from the given URL and returns it as a `File` object.
     *
     * @param url - The URL from which to download the file.
     * @param originalname - The original name of the file to be used when creating the `File` object.
     * @returns A promise that resolves to a `File` object containing the downloaded data.
     * @throws Will throw an error if the download fails or the response status is not 200.
     */
    public async downloadWABAFile(url: string, originalname: string): Promise<File> {
        const headers = { 'Authorization': `Bearer ${this.WABAToken}` };
        const responseType = 'arraybuffer';
        const response = await axios.get(url, { headers, responseType });

        if (response.status !== 200) {
            throw new Error("Error while downloading file. Status: " + response.status);
        }

        const contentType = response.headers['content-type'];
        const file = new File(Buffer.from(response.data), originalname, contentType);

        return file;
    }

    public async uploadWABAFile(file: File): Promise<{ id: string }> {
        const requestUrl = `https://graph.facebook.com/v16.0/${this.WABANumberId}/media`;
        const formData = new FormData();

        formData.append("file", file.buffer, file.name);
        formData.append("type", file.type);
        formData.append("messaging_product", "whatsapp");

        const headers = { 'Authorization': `Bearer ${this.WABAToken}`, ...formData.getHeaders() };
        const response = await axios.post(requestUrl, formData, { headers });

        return response.data;
    }
}

export default new WABAService();