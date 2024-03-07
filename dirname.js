import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const filesPath = join(__dirname, "/files");
export const tempPath = join(filesPath, "/temp");