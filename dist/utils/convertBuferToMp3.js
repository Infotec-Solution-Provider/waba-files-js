"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_stream_1 = require("node:stream");
/**
 * Converts a given audio buffer to MP3 format using ffmpeg.
 *
 * @param buffer - The input audio buffer to be converted.
 * @returns A promise that resolves to a buffer containing the MP3 data.
 * @throws An error if the ffmpeg process fails.
 */
function convertBufferToMp3(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
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
                    reject(new Error('ffmpeg error'));
                }
            });
            ffmpeg.on('error', (err) => {
                reject(new Error(`Error in ffmpeg process: ${err.message}`));
            });
            readable.pipe(ffmpeg.stdin);
        });
    });
}
exports.default = convertBufferToMp3;
