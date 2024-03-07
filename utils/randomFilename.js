import { randomUUID } from "node:crypto";

export function randomFilename(originalname) {
    const uuid = randomUUID();
    const filename = originalname.split(".")[0];
    const ext = originalname.split(".")[1]

    const generatedFilename = `${uuid}_${filename}.${ext}`;

    return generatedFilename;
}