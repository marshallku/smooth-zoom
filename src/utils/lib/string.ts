export function extractSizesFromSrcset(srcset: string) {
    const sizes = srcset.match(/ (\d+)w/gm) || [];
    return sizes.map((x) => +x.trim().replace("w", "")).filter((x) => !Number.isNaN(x));
}
