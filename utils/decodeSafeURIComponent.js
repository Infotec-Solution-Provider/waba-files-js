export function decodeSafeURIComponent(str) {
    try {
        const decodedStr = decodeURIComponent(str);

        return decodedStr;
    } catch {
        return str;
    }
}