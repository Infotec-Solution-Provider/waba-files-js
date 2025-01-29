"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_stream_1 = require("node:stream");
async function convertBufferToMp3(buffer) {
    return await new Promise((resolve, reject) => {
        const readable = new node_stream_1.Readable();
        readable.push(buffer);
        readable.push(null);
        const chunks = [];
        const ffmpeg = (0, node_child_process_1.spawn)('ffmpeg', [
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
            }
            else {
                reject(new Error('ffmpeg error. code: ' + code));
            }
        });
        ffmpeg.on('error', (err) => {
            console.error(err);
            reject(new Error(`Error in ffmpeg process: ${err.message}`));
        });
        readable.pipe(ffmpeg.stdin);
    });
}
exports.default = convertBufferToMp3;
//# sourceMappingURL=convertBuferToMp3.js.map