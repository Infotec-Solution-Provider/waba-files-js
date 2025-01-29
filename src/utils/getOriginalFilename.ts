/**
 * Extracts the original filename from a given random filename.
 * The random filename is expected to be in the format `prefix_originalFilename`.
 *
 * @param randomFilename - The random filename string to process.
 * @returns The original filename extracted from the random filename.
 */
export default function getOriginalFilename(randomFilename: string): string {
    return randomFilename.split("_").slice(1).join("_");
}