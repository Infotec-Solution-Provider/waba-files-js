"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_stream_1 = require("node:stream");
async function convertBufferToMp3(buffer) {
    console.log("Starting conversion of buffer to MP3 format...");
    return await new Promise((resolve, reject) => {
        const readable = new node_stream_1.Readable();
        readable.push(buffer);
        readable.push(null);
        const chunks = [];
        console.log("Spawning ffmpeg process...");
        const ffmpeg = (0, node_child_process_1.spawn)('ffmpeg', [
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
            }
            else {
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
exports.default = convertBufferToMp3;
//# sourceMappingURL=convertBuferToMp3.js.map