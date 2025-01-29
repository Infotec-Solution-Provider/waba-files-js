/**
 * Extracts the file extension from a given filename.
 *
 * @param filename - The name of the file from which to extract the extension.
 * @returns The file extension if present, otherwise an empty string.
 */
export default function getFileExtension(filename: string): string {
    if (!filename) return "";

    const split = filename.split(".");
    if (split.length <= 1) return ""
    
    return split[split.length - 1] || "";
}