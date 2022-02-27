import getAverageRGB from "./utils/getAverageRGB";

export default function Zoom(
    target?: TAllowedTargets,
    { background, useMaximumSize = true, onTransitionEnd }: IZoomOptions = {}
) {
    const zoom = (image: HTMLImageElement) => {
        const src = image.currentSrc || image.src;
        const { srcset, naturalWidth } = image;
        const { offsetWidth: screenWidth, clientHeight: screenHeight } =
            document.documentElement;
        const { width, height, left, top } = image.getBoundingClientRect();
        const wrapX = screenWidth / 2 - left - width / 2;
        const wrapY = -top + (screenHeight - height) / 2;
        const maxScale = Math.min(screenWidth / width, screenHeight / height);
        const sizes = srcset.match(/ ([0-9]+)w/gm) || [];
        const maxWidth = useMaximumSize
            ? Math.max(
                  naturalWidth,
                  ...sizes
                      .map((x) => +x.trim().replace("w", ""))
                      .filter((x) => !Number.isNaN(x) && naturalWidth < x)
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
                { once: true }
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

        bg.addEventListener("click", removeImage, { once: true });
        imageClone.addEventListener("click", removeImage, { once: true });
        window.addEventListener("scroll", removeImage, {
            once: true,
            passive: true,
        });
        window.addEventListener("resize", removeImage, {
            once: true,
            passive: true,
        });

        imageClone.style.top = `${top + window.scrollY}px`;
        imageClone.style.left = `${left}px`;
        imageClone.style.width = `${width}px`;
        imageClone.style.height = `${height}px`;

        imageClone.addEventListener(
            "transitionend",
            () => {
                onTransitionEnd?.(imageClone);
            },
            { once: true }
        );

        document.body.append(bg, imageClone);

        // Hide original image
        image.classList.add("zoom-original--hidden");

        // For transition
        window.requestAnimationFrame(() => {
            imageClone.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${wrapX}, ${wrapY})`;
            bg.classList.add("zoom-bg--reveal");
        });
    };

    const handleClick = (event: MouseEvent) => {
        zoom(event.target as HTMLImageElement);
    };

    const attach = (target: TAllowedTargets) => {
        if (!target) {
            return;
        }

        if (typeof target === "string") {
            document.querySelectorAll(target).forEach(addZoomEvent);

            // Add cursor style for target
            const style = document.createElement("style");
            const { head } = document;

            style.appendChild(
                document.createTextNode(`${target}{cursor:zoom-in}`)
            );
            head.appendChild(style);

            return;
        }

        if (target instanceof HTMLElement) {
            addZoomEvent(target);
            return;
        }

        target.forEach(addZoomEvent);
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

    target && attach(target);

    return {
        zoom,
        attach,
    };
}
