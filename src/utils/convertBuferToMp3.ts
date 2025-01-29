import { spawn } from "node:child_process";
import { Readable } from "node:stream";

/**
 * Converts a given audio buffer to MP3 format using ffmpeg.
 *
 * @param buffer - The input audio buffer to be converted.
 * @returns A promise that resolves to a buffer containing the MP3 data.
 * @throws An error if the ffmpeg process fails.
 */
export default async function convertBufferToMp3(buffer: Buffer): Promise<Buffer> {
    console.log("Starting conversion of buffer to MP3 format...");

    return await new Promise<Buffer>((resolve, reject) => {
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);

        const chunks: any[] = [];
        console.log("Spawning ffmpeg process...");

        const ffmpeg = spawn('ffmpeg', [
            '-i', 'pipe:0',
            '-c:a', 'libmp3lame',
            '-b:a', '128k',
            'pipe:1'
        ]);

        ffmpeg.stdout.on('data', (chunk) => {
            console.log("Received data chunk from ffmpeg...");
            chunks.push(chunk);
        });

        ffmpeg.stderr.on('data', (data) => {
            console.error(`ffmpeg stderr: ${data}`);
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                console.log("ffmpeg process closed successfully.");
                resolve(Buffer.concat(chunks));
            } else {
                console.error(`ffmpeg process exited with code ${code}`);
                reject(new Error('ffmpeg error. code: ' + code));
            }
        });

        ffmpeg.on('error', (err) => {
            console.error(`Error in ffmpeg process: ${err.message}`);
            reject(new Error(`Error in ffmpeg process: ${err.message}`));
        });

        console.log("Piping buffer to ffmpeg stdin...");
        readable.pipe(ffmpeg.stdin);
    });
}