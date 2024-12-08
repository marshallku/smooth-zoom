import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { fireEvent } from "@testing-library/dom";
import Zoom from "../zoom";
import type { ZoomOption } from "../types/zoom";

/**
 * Default option for suppressing HTML Canvas error
 */
const DEFAULT_OPTION: ZoomOption = { background: "#000" };

describe("Zoom", () => {
    let container: HTMLDivElement;
    let image: HTMLImageElement;

    beforeEach(() => {
        // Setup basic DOM environment
        container = document.createElement("div");
        image = document.createElement("img");
        image.src = "test-image.jpg";
        image.width = 100;
        image.height = 100;
        container.appendChild(image);
        document.body.appendChild(container);

        // Mock window methods
        vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
            const now = performance.now();
            cb(now);
            return now;
        });

        // Mock getBoundingClientRect
        vi.spyOn(image, "getBoundingClientRect").mockReturnValue({
            width: 100,
            height: 100,
            left: 0,
            top: 0,
            right: 100,
            bottom: 100,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        // Mock document dimensions
        Object.defineProperty(document.documentElement, "offsetWidth", {
            configurable: true,
            value: 1024,
        });
        Object.defineProperty(document.documentElement, "clientHeight", {
            configurable: true,
            value: 768,
        });
    });

    afterEach(() => {
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });

    describe("Initialization", () => {
        test("should initialize with string selector", () => {
            const zoomInstance = Zoom(".test-image", DEFAULT_OPTION);
            expect(zoomInstance.zoom).toBeDefined();
            expect(zoomInstance.attach).toBeDefined();
            expect(zoomInstance.detach).toBeDefined();
        });

        test("should initialize with HTMLElement", () => {
            const zoomInstance = Zoom(image, DEFAULT_OPTION);
            expect(zoomInstance.zoom).toBeDefined();
        });
    });

    describe("Zoom functionality", () => {
        test("should create zoom overlay when image is clicked", () => {
            Zoom(image, DEFAULT_OPTION);
            fireEvent.click(image);

            const zoomedImage = document.querySelector(".zoom-img");
            const background = document.querySelector(".zoom-bg");

            expect(zoomedImage).toBeTruthy();
            expect(background).toBeTruthy();
            expect(image.classList.contains("zoom-original--hidden")).toBe(true);
        });

        test("should remove zoom when Escape key is pressed", () => {
            Zoom(image, DEFAULT_OPTION);

            fireEvent.click(image);
            fireEvent.keyDown(document, { key: "Escape" });

            const background = document.querySelector(".zoom-bg");
            expect(background?.classList.contains("zoom-bg--reveal")).toBe(false);
        });

        test("should handle custom background color", () => {
            const customBg = "rgba(0, 0, 0, 0.8)";
            Zoom(image, { background: customBg });
            fireEvent.click(image);

            const background = document.querySelector(".zoom-bg") as HTMLElement;
            expect(background.style.background).toBe(customBg);
        });
    });

    describe("Event handlers", () => {
        test("should call onTransitionEnd callback", () => {
            const onTransitionEnd = vi.fn();
            Zoom(image, { ...DEFAULT_OPTION, onTransitionEnd });
            fireEvent.click(image);

            const zoomedImage = document.querySelector(".zoom-img");
            fireEvent.transitionEnd(zoomedImage!);

            expect(onTransitionEnd).toHaveBeenCalled();
        });

        test("should call onClick callback", () => {
            const onClick = vi.fn();
            Zoom(image, { ...DEFAULT_OPTION, onClick });
            fireEvent.click(image);

            expect(onClick).toHaveBeenCalledWith(image);
        });
    });

    describe("Cleanup", () => {
        test("should remove zoom on window scroll", () => {
            Zoom(image, DEFAULT_OPTION);
            fireEvent.click(image);

            fireEvent.scroll(window);

            const background = document.querySelector(".zoom-bg");
            expect(background?.classList.contains("zoom-bg--reveal")).toBe(false);
        });

        test("should remove zoom on window resize", () => {
            Zoom(image, DEFAULT_OPTION);
            fireEvent.click(image);

            fireEvent.resize(window);

            const background = document.querySelector(".zoom-bg");
            expect(background?.classList.contains("zoom-bg--reveal")).toBe(false);
        });
    });

    describe("Edge cases", () => {
        test("should handle missing srcset", () => {
            image.removeAttribute("srcset");
            Zoom(image, DEFAULT_OPTION);
            fireEvent.click(image);

            const zoomedImage = document.querySelector(".zoom-img");
            expect(zoomedImage).toBeTruthy();
        });
    });
});
