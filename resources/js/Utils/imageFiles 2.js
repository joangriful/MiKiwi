export function extractImageFiles(fileList) {
    return Array.from(fileList).filter((file) => file.type.startsWith('image/'));
}
