/**
 * Safely decodes a URI component.
 *
 * This function attempts to decode a URI component using `decodeURIComponent`.
 * If decoding fails (e.g., due to malformed input), it returns the original string.
 *
 * @param string - The URI component to decode.
 * @returns The decoded URI component, or the original string if decoding fails.
 */
export default function safeDecodeURIComponent(string: string): string {
    try {
        const decodedString = decodeURIComponent(string);

        return decodedString;
    } catch {
        return string;
    }
}