/*
 *
 *  Source of the code below
 *  https://stackoverflow.com/a/2541680
 *
 */

export default function getAverageRGB(img: HTMLImageElement) {
    const blockSize = 5;
    const rgb = { r: 0, g: 0, b: 0 };
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return rgb;
    }
    const width = (canvas.width =
        img.naturalWidth || img.offsetWidth || img.width);
    const height = (canvas.height =
        img.naturalHeight || img.offsetHeight || img.height);

    let data;
    let i = -4;
    let length;
    let count = 0;

    ctx.drawImage(img, 0, 0);

    try {
        data = ctx.getImageData(0, 0, width, height);
    } catch (e) {
        return rgb;
    }

    length = data.data.length;
    while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    rgb.r = Math.floor(rgb.r / count);
    rgb.g = Math.floor(rgb.g / count);
    rgb.b = Math.floor(rgb.b / count);

    return rgb;
}
