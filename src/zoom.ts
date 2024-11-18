import { AllowedTarget, ZoomOption } from "./types/zoom";
import getAverageRGB from "./utils/getAverageRGB";

const zoom = (image: HTMLImageElement, { background, useMaximumSize = true, onTransitionEnd }: ZoomOption) => {
    const src = image.currentSrc || image.src;
    const { srcset, naturalWidth } = image;
    const { offsetWidth: screenWidth, clientHeight: screenHeight } = document.documentElement;
    const { width, height, left, top } = image.getBoundingClientRect();
    const wrapX = screenWidth / 2 - left - width / 2;
    const wrapY = -top + (screenHeight - height) / 2;
    const maxScale = Math.min(screenWidth / width, screenHeight / height);
    const sizes = srcset.match(/ ([0-9]+)w/gm) || [];
    const maxWidth = useMaximumSize
        ? Math.max(
              naturalWidth,
              ...sizes.map((x) => +x.trim().replace("w", "")).filter((x) => !Number.isNaN(x) && naturalWidth < x),
          )
        : naturalWidth;
    const imageScale = maxWidth / width;
    const scale = Math.min(maxScale, imageScale);
    const bg = document.createElement("div");
    const imageClone = document.createElement("img");

    const removeImage = () => {
        bg.classList.remove("zoom-bg--reveal");
        imageClone.style.transform = "";
        imageClone.addEventListener(
            "transitionend",
            () => {
                bg.remove();
                image.classList.remove("zoom-original--hidden");
                imageClone.remove();
            },
            { once: true },
        );
        bg.removeEventListener("click", removeImage);
        imageClone.removeEventListener("click", removeImage);
        window.removeEventListener("scroll", removeImage);
        window.removeEventListener("resize", removeImage);
    };

    bg.classList.add("zoom-bg");

    if (background) {
        if (background === "auto") {
            const { r, g, b } = getAverageRGB(image, width, height);

            bg.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.95)`;
        } else {
            bg.style.background = background;
        }
    }

    imageClone.classList.add("zoom-img");
    imageClone.src = src;
    imageClone.width = width;
    imageClone.height = height;
    imageClone.style.top = `${top + window.scrollY}px`;
    imageClone.style.left = `${left}px`;
    imageClone.style.width = `${width}px`;
    imageClone.style.height = `${height}px`;

    bg.addEventListener("click", removeImage, { once: true });
    imageClone.addEventListener("click", removeImage, { once: true });
    imageClone.addEventListener(
        "transitionend",
        () => {
            onTransitionEnd?.(imageClone);
        },
        { once: true },
    );
    window.addEventListener("scroll", removeImage, {
        once: true,
        passive: true,
    });
    window.addEventListener("resize", removeImage, {
        once: true,
        passive: true,
    });

    document.body.append(bg, imageClone);

    // Hide original image
    image.classList.add("zoom-original--hidden");

    // For transition
    window.requestAnimationFrame(() => {
        window.setTimeout(() => {
            imageClone.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${wrapX}, ${wrapY})`;
            bg.classList.add("zoom-bg--reveal");
        });
    });
};

export default function Zoom(target?: AllowedTarget, option: ZoomOption = {}) {
    const handleClick = (event: MouseEvent) => {
        option.onClick?.(event.target as HTMLImageElement);
        zoom(event.target as HTMLImageElement, option);
    };

    const addZoomEvent = (element: HTMLElement | Node) => {
        if (!(element instanceof HTMLElement)) {
            return;
        }

        if (element.tagName === "IMG") {
            element.addEventListener("click", handleClick);
            return;
        }

        element.querySelector("img")?.addEventListener("click", handleClick);
    };

    const removeZoomEvent = (element: HTMLElement | Node) => {
        if (!(element instanceof HTMLElement)) {
            return;
        }

        if (element.tagName === "IMG") {
            element.removeEventListener("click", handleClick);
            return;
        }

        element.querySelector("img")?.removeEventListener("click", handleClick);
    };

    const attach = (target: AllowedTarget) => {
        if (!target) {
            return;
        }

        if (typeof target === "string") {
            document.querySelectorAll(target).forEach(addZoomEvent);

            // Add cursor style for target
            const style = document.createElement("style");
            const { head } = document;

            style.appendChild(document.createTextNode(`${target}{cursor:zoom-in}`));
            head.appendChild(style);

            return;
        }

        if (target instanceof HTMLElement) {
            addZoomEvent(target);
            return;
        }

        target.forEach(addZoomEvent);
    };

    const detach = (target: AllowedTarget) => {
        if (!target) {
            return;
        }

        if (typeof target === "string") {
            document.querySelectorAll(target).forEach(removeZoomEvent);
            return;
        }

        if (target instanceof HTMLElement) {
            removeZoomEvent(target);
            return;
        }

        target.forEach(removeZoomEvent);
    };

    if (target) {
        attach(target);
    }

    return {
        zoom,
        attach,
        detach,
    };
}
