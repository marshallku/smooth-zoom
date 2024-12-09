import { extractSizesFromSrcset } from "./string";

export interface ZoomBoard {
    width: number;
    height: number;
}

export interface ZoomTarget {
    width: number;
    height: number;
    left: number;
    top: number;
}

interface ScaleOptions {
    naturalWidth: number;
    srcset: string;
    useMaximumSize: boolean;
}

export function calculateScale(
    board: ZoomBoard,
    target: ZoomTarget,
    { naturalWidth, srcset, useMaximumSize }: ScaleOptions,
): {
    maxScale: number;
    scale: number;
    x: number;
    y: number;
} {
    const maxScale = Math.min(board.width / target.width, board.height / target.height);
    const maxWidth = useMaximumSize
        ? Math.max(naturalWidth, ...extractSizesFromSrcset(srcset).filter((x) => naturalWidth < x))
        : naturalWidth;
    const imageScale = maxWidth / target.width;
    const x = board.width / 2 - target.left - target.width / 2;
    const y = -target.top + (board.height - target.height) / 2;

    return {
        maxScale,
        scale: Math.min(maxScale, imageScale),
        x,
        y,
    };
}
