import { join } from "node:path";
import { __dirname } from "../dirname.js";
import { Readable } from "node:stream";
import { spawn } from "node:child_process";
import { randomFilename } from "./randomFilename.js";

export async function saveAudioAsMp3(buffer, path, originalname, callback) {
    const saveFilename = randomFilename(`${originalname.split(".")[0]}.mp3`);
    const savePath = join(path, saveFilename);

    return new Promise((res, rej) => {
        const readableStream = new Readable();

        readableStream.push(buffer);

        readableStream.push(null);

        const ffmpeg = spawn('ffmpeg', [
            '-i', 'pipe:0',
            '-c:a', 'libmp3lame',
            '-b:a', '128k',
            savePath
        ]);

        const chunks = [];

        ffmpeg.stdout.on('data', (chunk) => {
            chunks.push(chunk);
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                if (callback) {
                    res(callback(savePath, saveFilename))
                }
                res(saveFilename);
            } else {
                rej(new Error(`ffmpeg process exited with code ${code}`));
            }
        });

        ffmpeg.on('error', (err) => {
            rej(new Error(`Error in ffmpeg process: ${err.message}`));
        });

        readableStream.pipe(ffmpeg.stdin);
    });
}