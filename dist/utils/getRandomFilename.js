"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
function getRandomFilename(originalname) {
    const uuid = (0, node_crypto_1.randomUUID)();
    const filename = originalname.split(".")[0];
    const ext = originalname.split(".")[1];
    const generatedFilename = `${uuid}_${filename}.${ext}`;
    return generatedFilename;
}
exports.default = getRandomFilename;
//# sourceMappingURL=getRandomFilename.js.map