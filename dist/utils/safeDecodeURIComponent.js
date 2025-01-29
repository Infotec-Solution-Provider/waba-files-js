"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function safeDecodeURIComponent(string) {
    try {
        const decodedString = decodeURIComponent(string);
        return decodedString;
    }
    catch {
        return string;
    }
}
exports.default = safeDecodeURIComponent;
//# sourceMappingURL=safeDecodeURIComponent.js.map