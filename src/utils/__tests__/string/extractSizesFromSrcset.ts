import { describe, it, expect } from "vitest";
import { extractSizesFromSrcset } from "../..";

describe("extractSizesFromSrcset", () => {
    it("should extract sizes from a valid srcset string", () => {
        const srcset = "image1.jpg 400w, image2.jpg 800w, image3.jpg 1200w";
        const result = extractSizesFromSrcset(srcset);
        expect(result).toEqual([400, 800, 1200]);
    });

    it("should return an empty array if the srcset string is empty", () => {
        const srcset = "";
        const result = extractSizesFromSrcset(srcset);
        expect(result).toEqual([]);
    });
});
