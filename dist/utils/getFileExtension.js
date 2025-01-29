"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFileExtension(filename) {
    if (!filename)
        return "";
    const split = filename.split(".");
    if (split.length <= 1)
        return "";
    return split[split.length - 1] || "";
}
exports.default = getFileExtension;
//# sourceMappingURL=getFileExtension.js.map