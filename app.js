import express from "express";
import multer from "multer";
import fs, { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer();

app.use(express.json());

function logWithDate(str, error) {
    const dateSring = new Date().toLocaleString();

    if (error) {
        console.error(`${dateSring}: ${str}`, error);
    } else {
        console.log(`${dateSring}: ${str}`);
    }
}

function isUUID(str) {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(str);
}

app.get("/:filename", async (req, res) => {
    try {
        const fileName = req.params.filename;
        const searchFilePath = join(__dirname, "/files", fileName);

        if (!existsSync(searchFilePath)) {
            return res.status(404).json({ message: "File not found" });
        }
        const file = readFileSync(searchFilePath);
        const haveUUID = isUUID(fileName.split("_")[0])
        const fileNameWithoutUUID = haveUUID ? fileName.split("_").slice(1).join("_") : fileName;

        res.setHeader('Content-Disposition', `inline; filename="${fileNameWithoutUUID}"`);
        res.end(file);

        logWithDate("Get file success =>", fileName);
    } catch (err) {
        // Log and send error response
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

        const uuid = randomUUID();
        const filename = req.file.originalname.split(".")[0]
        const ext = req.file.originalname.split(".")[1]
        const generatedName = `${uuid}_${filename}.${ext}`;
        const filePath = join(__dirname, "/files", generatedName);

        writeFileSync(filePath, req.file.buffer);

        res.status(201).json({ filename: generatedName });

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
            responseType: 'arraybuffer', // Indica que esperamos uma resposta binária
        };

        const response = await axios(axiosConfig);

        if (!response.status === 200) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const contentType = response.headers['content-type'];
        const extMatch = contentType && contentType.match(/\/([a-zA-Z]+)/);
        const ext = extMatch ? extMatch[1] : '';

        console.log(response.headers)
        const uuid = randomUUID();

        const currentDir = dirname(fileURLToPath(import.meta.url));
        const filePath = join(currentDir, "/files", `${uuid}.${ext}`);
        
        writeFileSync(filePath, response.data);

        res.status(201).json({ filename: `${uuid}.${ext}` });
    } catch (err) {
        logWithDate("Fetch error => ", err);
        res.status(500).json({ message: "Failed to fetch data" });
    }
});

app.listen(7000, () => {
    logWithDate("App listening on port 7000")
});
