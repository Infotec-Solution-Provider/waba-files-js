"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Extracts the original filename from a given random filename.
 * The random filename is expected to be in the format `prefix_originalFilename`.
 *
 * @param randomFilename - The random filename string to process.
 * @returns The original filename extracted from the random filename.
 */
function getOriginalFilename(randomFilename) {
    return randomFilename.split("_").slice(1).join("_");
}
exports.default = getOriginalFilename;
