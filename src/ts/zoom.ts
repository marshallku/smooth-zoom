import getAverageRGB from "./utils/getAverageRGB";

export default function Zoom(
    target: TAllowedTargets,
    options: {
        background?: string;
        onTransitionEnd?: (img: HTMLImageElement) => void;
    } = {}
) {
    const screenSize = {
        screenWidth: 0,
        screenHeight: 0,
        scrollBar: 0,
    };
    const { background, onTransitionEnd } = options;

    const updateScreenSize = () => {
        const { documentElement } = document;

        screenSize.screenWidth =
            window.innerWidth || documentElement.clientWidth;
        screenSize.screenHeight =
            window.innerHeight || documentElement.clientHeight;
        screenSize.scrollBar =
            screenSize.screenWidth - documentElement.offsetWidth;
    };

    const zoom = (image: HTMLImageElement) => {
        const src = image.currentSrc || image.src;
        const { srcset } = image;
        const { screenWidth, screenHeight, scrollBar } = screenSize;
        const { width, height, left, top } = image.getBoundingClientRect();
        const wrapX = (screenWidth - scrollBar) / 2 - left - width / 2;
        const wrapY = -top + (screenHeight - height) / 2;
        const bg = document.createElement("div");
        const imageClone = document.createElement("img");
        let maxWidth = image.naturalWidth;

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
                const average = getAverageRGB(image);
                bg.style.background = average
                    ? `rgb(${average.r}, ${average.g}, ${average.b})`
                    : "rgb(0, 0, 0)";
            } else {
                bg.style.background = background;
            }
        }

        if (srcset) {
            const sizes = srcset.match(/ ([0-9]+)w/gm);

            if (sizes) {
                // Find image's largest width in 'srcset' attribute
                maxWidth = sizes
                    .map((x) => +x.trim().replace("w", ""))
                    .filter((x) => !Number.isNaN(x))
                    .reduce((acc, cur) => Math.max(acc, cur), 0);
            }
        }

        const ratio = height / width;

        // Image's width shouldn't be larger than screen width
        maxWidth = Math.min(maxWidth, screenWidth);
        // And height too
        const maxHeight = maxWidth * ratio;

        if (maxHeight >= screenHeight) {
            maxWidth = (maxWidth * screenHeight) / maxHeight;
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

        document.body.append(bg, imageClone);

        // Added here for causing style recalculation
        imageClone.style.top = `${top + window.scrollY}px`;
        imageClone.style.left = `${left}px`;
        imageClone.style.width = `${width}px`;
        imageClone.style.height = `${height}px`;

        // Hide original image
        image.classList.add("zoom-original--hidden");

        // Reveal and center cloned image, scale up if needed
        const scale = maxWidth !== width ? maxWidth / width : 1;

        imageClone.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${wrapX}, ${wrapY})`;
        bg.classList.add("zoom-bg--reveal");

        imageClone.addEventListener(
            "transitionend",
            () => {
                onTransitionEnd?.(imageClone);
            },
            { once: true }
        );
    };

    const handleClick = (event: MouseEvent) => {
        zoom(event.target as HTMLImageElement);
    };

    const attach = (target: TAllowedTargets) => {
        if (!target) return;

        if (typeof target === "string") {
            document.querySelectorAll(target).forEach(addZoomEvent);
        } else if (target instanceof HTMLElement) {
            addZoomEvent(target);
        } else if (target instanceof NodeList || target instanceof Array) {
            target.forEach(addZoomEvent);
        }

        // Add cursor style for target
        if (typeof target === "string") {
            const style = document.createElement("style");
            const head =
                document.head || document.getElementsByTagName("head")[0];

            style.appendChild(
                document.createTextNode(`${target}{cursor:zoom-in}`)
            );
            head.appendChild(style);
        }
    };

    const addZoomEvent = (element: HTMLElement | Node) => {
        if (!(element instanceof HTMLElement)) return;
        if (element.tagName === "IMG") {
            element.addEventListener("click", handleClick);
        } else {
            const childImg = element.querySelector("img");
            if (childImg) {
                childImg.addEventListener("click", handleClick);
            }
        }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize, { passive: true });

    attach(target);

    return {
        zoom,
        attach,
    };
}
