import { spawn } from "node:child_process";
import { Readable } from "node:stream";
import Log from "./log";

/**
 * Converts a given audio buffer to MP3 format using ffmpeg.
 *
 * @param buffer - The input audio buffer to be converted.
 * @returns A promise that resolves to a buffer containing the MP3 data.
 * @throws An error if the ffmpeg process fails.
 */
export default async function convertBufferToMp3(buffer: Buffer): Promise<Buffer> {
       return await new Promise<Buffer>((resolve, reject) => {
        const readable = new Readable();
        
        readable.push(buffer);
        readable.push(null);

        const chunks: any[] = [];

        const ffmpeg = spawn('ffmpeg', [
            '-i', 'pipe:0',
            '-f', 'mp3', // Specify the output format
            '-c:a', 'libmp3lame',
            '-b:a', '128k',
            'pipe:1'
        ]);

        ffmpeg.stdout.on('data', (chunk) => {
            chunks.push(chunk);
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                resolve(Buffer.concat(chunks));
            } else {
                Log.error(null, `ffmpeg process exited with code ${code}`);

                reject(new Error('ffmpeg error. code: ' + code));
            }
        });

        ffmpeg.on('error', (err) => {
            Log.error(err, `Error in ffmpeg process: ${err.message}`);
            
            reject(new Error(`Error in ffmpeg process: ${err.message}`));
        });

        readable.pipe(ffmpeg.stdin);
    });
}