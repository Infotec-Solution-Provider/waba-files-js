"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Safely decodes a URI component.
 *
 * This function attempts to decode a URI component using `decodeURIComponent`.
 * If decoding fails (e.g., due to malformed input), it returns the original string.
 *
 * @param string - The URI component to decode.
 * @returns The decoded URI component, or the original string if decoding fails.
 */
function safeDecodeURIComponent(string) {
    try {
        const decodedString = decodeURIComponent(string);
        return decodedString;
    }
    catch (_a) {
        return string;
    }
}
exports.default = safeDecodeURIComponent;
