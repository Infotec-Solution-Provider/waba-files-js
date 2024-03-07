import axios from "axios";
import express from "express";
import mime from "mime";
import multer from "multer";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { __dirname, filesPath, tempPath } from "./dirname.js";
import { logWithDate } from "./utils/logWithDate.js";
import { saveAudioAsMp3 } from "./utils/saveAudioAsMp3.js";
import { unrandomFilename } from "./utils/unrandomFilename.js";
import { randomFilename } from "./utils/randomFilename.js";
import { uploadMedia } from "./utils/uploadMedia.js";

const app = express();
const upload = multer();

app.use(express.json());

app.post("/convert-to-mp3", upload.single("file"), async (req, res) => {
    try {
        const { numberId, token } = req.body;

        if (!existsSync(tempPath)) {
            mkdirSync(tempPath);
        }

        await saveAudioAsMp3(req.file.buffer, tempPath, req.file.originalname, async (path, filename) => {
            const convertedBuffer = readFileSync(path);
            const mimeType = mime.getType(path);
            const mediaId = await uploadMedia(numberId, convertedBuffer, filename, mimeType, token);

            res.send(mediaId);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message || 'Erro desconhecido ao processar a requisição');
    }
});

app.get("/:filename", async (req, res) => {
    try {
        const filename = req.params.filename;
        const searchFilePath = join(filesPath, filename);

        if (!existsSync(searchFilePath)) {
            return res.status(404).json({ message: "File not found" });
        }
        const file = readFileSync(searchFilePath);

        res.setHeader('Content-Disposition', `inline; filename="${unrandomFilename(filename)}"`);
        res.end(file);

        logWithDate("Get file success =>", filename);
    } catch (err) {
        logWithDate("Get file failure =>", err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.post("", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send();
            return;
        }

        if (req.file.mimetype.includes("audio")) {
            const filename = await saveAudioAsMp3(req.file.buffer, filesPath, req.file.originalname);

            res.status(201).json({ filename });
        } else {
            const filename = randomFilename(req.file.originalname);
            const savePath = join(filesPath, filename);

            writeFileSync(savePath, req.file.buffer);

            res.status(201).json({ filename });
        }
    } catch (err) {
        logWithDate("Upload file failure => ", err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.post("/waba-file", async (req, res) => {
    try {
        const { token, url } = req.body;
        const myHeaders = {
            'Authorization': `Bearer ${token}`,
        };

        const axiosConfig = {
            method: 'get',
            headers: myHeaders,
            url,
            responseType: 'arraybuffer',
        };

        const response = await axios(axiosConfig);

        if (!response.status === 200) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const contentType = response.headers['content-type'];
        const extMatch = contentType && contentType.match(/\/([a-zA-Z]+)/);
        const ext = extMatch ? extMatch[1] : '';
        const buffer = response.data;

        if (contentType.includes("audio")) {
            const filename = await saveAudioAsMp3(buffer, filesPath, `audio.${ext}`);

            res.status(201).json({ filename });
        } else {
            const filename = randomFilename(`file.${ext}`);
            const filePath = join(filesPath, filename);
            writeFileSync(filePath, buffer);

            res.status(201).json({ filename });
        }
    } catch (err) {
        logWithDate("Fetch error => ", err);
        res.status(500).json({ message: "Failed to fetch data" });
    }
});

app.post("/media-id/:filename", async (req, res) => {
    const { numberId, token } = req.body;
    const fileName = req.params.filename;

    const searchFilePath = join(__dirname, "/files", fileName);

    if (!existsSync(searchFilePath)) {
        return res.status(404).json({ message: "File not found" });
    }

    const file = readFileSync(searchFilePath);
    const mimeType = mime.getType(searchFilePath);
    const fileNameWithoutUUID = unrandomFilename(fileName);

    const mediaId = await uploadMedia(numberId, file, fileNameWithoutUUID, mimeType, token);

    res.send({ ...mediaId, mimeType });
})

app.listen(7000, () => {
    logWithDate("App listening on port 7000")
});
