import { randomUUID } from "node:crypto";

/**
 * Generates a random filename by appending a UUID to the original filename.
 *
 * @param originalname - The original filename including its extension.
 * @returns A new filename with a UUID appended to the original filename.
 */
export default function getRandomFilename(originalname: string): string {
    const uuid = randomUUID();
    const filename = originalname.split(".")[0];
    const ext = originalname.split(".")[1]

    const generatedFilename = `${uuid}_${filename}.${ext}`;

    return generatedFilename;
}