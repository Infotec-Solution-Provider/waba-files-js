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
    return await new Promise<Buffer>((resolve, reject) => {
        try {
            const readable = new Readable();

            readable.push(buffer);
            readable.push(null);
    
            const chunks: any[] = [];
            const ffmpeg = spawn('ffmpeg', [
                '-i', 'pipe:0',
                '-c:a', 'libmp3lame',
                '-b:a', '128k',
            ]);
    
            ffmpeg.stdout.on('data', (chunk) => {
                chunks.push(chunk);
            });
    
            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    resolve(Buffer.concat(chunks));
                } else {
                    reject(new Error('ffmpeg error'));
                }
            });
    
            ffmpeg.on('error', (err) => {
                console.error(err);
                reject(new Error(`Error in ffmpeg process: ${err.message}`));
            });
    
            readable.pipe(ffmpeg.stdin);
        } catch (err) {
            console.error(err);
        }
    });
}