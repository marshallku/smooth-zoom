/*
 *
 *  Source of the code below
 *  https://stackoverflow.com/a/2541680
 *
 */

export default function getAverageRGB(img: HTMLImageElement) {
    const blockSize = 20;
    const rgb = { r: 0, g: 0, b: 0 };
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return rgb;
    }
    const width = img.naturalWidth || img.offsetWidth || img.width;
    const height = img.naturalHeight || img.offsetHeight || img.height;

    canvas.width = width;
    canvas.height = height;

    try {
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, width, height);

        const { data } = imageData;
        const { length } = data;
        const count = length / blockSize;

        for (let i = 0; i < length; i += blockSize) {
            rgb.r += data[i];
            rgb.g += data[i + 1];
            rgb.b += data[i + 2];
        }

        rgb.r = Math.floor(rgb.r / count);
        rgb.g = Math.floor(rgb.g / count);
        rgb.b = Math.floor(rgb.b / count);
    } catch {
        return rgb;
    }

    return rgb;
}
