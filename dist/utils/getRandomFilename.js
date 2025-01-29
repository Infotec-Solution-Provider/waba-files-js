"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
/**
 * Generates a random filename by appending a UUID to the original filename.
 *
 * @param originalname - The original filename including its extension.
 * @returns A new filename with a UUID appended to the original filename.
 */
function getRandomFilename(originalname) {
    const uuid = (0, node_crypto_1.randomUUID)();
    const filename = originalname.split(".")[0];
    const ext = originalname.split(".")[1];
    const generatedFilename = `${uuid}_${filename}.${ext}`;
    return generatedFilename;
}
exports.default = getRandomFilename;
