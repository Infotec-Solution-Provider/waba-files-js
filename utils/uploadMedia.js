import FormData from "form-data";
import axios from "axios";

export async function uploadMedia(numberId, file, filename, mimetype, token) {
    try {
        const fileRequestURL = `https://graph.facebook.com/v16.0/${numberId}/media`;
        const fileRequestForm = new FormData();

        fileRequestForm.append('file', file, {
            filename: filename,
            contentType: mimetype
        });

        fileRequestForm.append('type', mimetype);
        fileRequestForm.append('messaging_product', "whatsapp");

        const fileRequestHeaders = fileRequestForm.getHeaders();
        const fileRequestOptions = {
            headers: {
                Authorization: `Bearer ${token}`,
                ...fileRequestHeaders // Incluindo todos os headers necessários
            }
        };

        const response = await axios.post(fileRequestURL, fileRequestForm, fileRequestOptions);

        return response.data;
    } catch (err) {
        console.error(err.response?.data || err)
        return null;
    }
}