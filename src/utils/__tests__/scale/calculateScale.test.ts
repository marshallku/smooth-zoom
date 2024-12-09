import { describe, it, expect } from "vitest";
import { calculateScale, ZoomBoard, ZoomTarget } from "../../lib/scale";

describe("calculateScale", () => {
    const board: ZoomBoard = { width: 1200, height: 800 };

    it("should return correct scale and positions with a simple case", () => {
        const target: ZoomTarget = { width: 400, height: 400, left: 100, top: 100 };
        const srcset = "image1.jpg 800w, image2.jpg 1200w";
        const options = { naturalWidth: 800, srcset, useMaximumSize: true };

        const result = calculateScale(board, target, options);
        expect(result.maxScale).toEqual(2);
        expect(result.scale).toEqual(2);
        expect(result.x).toEqual(300);
        expect(result.y).toEqual(100);
    });

    it("should handle no srcset gracefully", () => {
        const target: ZoomTarget = { width: 300, height: 300, left: 0, top: 0 };
        const srcset = "";
        const options = { naturalWidth: 600, srcset, useMaximumSize: true };

        const result = calculateScale(board, target, options);
        expect(result.maxScale).toBeCloseTo(2.66666, 3);
        expect(result.scale).toBeCloseTo(2);
        expect(result.x).toEqual(450);
        expect(result.y).toEqual(250);
    });

    it("should correctly compute translation when target is large", () => {
        const target: ZoomTarget = { width: 1300, height: 1000, left: 50, top: 100 };
        const srcset = "imgA.jpg 800w";
        const options = { naturalWidth: 800, srcset, useMaximumSize: true };

        const result = calculateScale(board, target, options);
        expect(result.maxScale).toBeCloseTo(0.8, 3);
        expect(result.scale).toBeCloseTo(0.615, 3);
        expect(result.x).toBeCloseTo(-100);
        expect(result.y).toBeCloseTo(-200);
    });

    it("should not pick larger sizes from srcset if useMaximumSize=false", () => {
        const target: ZoomTarget = { width: 400, height: 400, left: 200, top: 200 };
        const srcset = "imgA.jpg 800w, imgB.jpg 1000w";
        const options = { naturalWidth: 800, srcset, useMaximumSize: false };

        const result = calculateScale(board, target, options);
        expect(result.maxScale).toEqual(2);
        expect(result.scale).toEqual(2);
        expect(result.x).toEqual(200);
        expect(result.y).toEqual(0);
    });

    it("should handle edge cases with zero width or height gracefully", () => {
        const target: ZoomTarget = { width: 0, height: 300, left: 0, top: 0 };
        const srcset = "imgA.jpg 800w";
        const options = { naturalWidth: 800, srcset, useMaximumSize: true };

        expect(() => calculateScale(board, target, options)).not.toThrow();
        const result = calculateScale(board, target, options);

        expect(result).toHaveProperty("maxScale");
        expect(result).toHaveProperty("scale");
        expect(result).toHaveProperty("x");
        expect(result).toHaveProperty("y");
    });
});
