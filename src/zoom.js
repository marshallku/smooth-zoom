export default function Zoom(selector, options) {
    const originalizer =
        options && options.originalizer
            ? options.originalizer
            : (src) => {
                  return src;
              };
    const screenSize = {
        screenWidth: 0,
        screenHeight: 0,
        scrollBar: 0,
    };
    const background =
        options && options.background ? options.background : null;
    const updateScreenSize = () => {
        const { documentElement } = document;
        screenSize.screenWidth =
            window.innerWidth || documentElement.clientWidth;
        screenSize.screenHeight =
            window.innerHeight || documentElement.clientHeight;
        screenSize.scrollBar =
            screenSize.screenWidth - documentElement.offsetWidth;
    };
    const zoom = (image) => {
        const src = image.currentSrc || image.src;
        const { srcset } = image;
        const { screenWidth, screenHeight, scrollBar } = screenSize;
        const rect = image.getBoundingClientRect();
        const { width, height, left, top } = rect;
        const halfX = (screenWidth - width) / 2;
        const halfY = (screenHeight - height) / 2;
        const wrapX = (screenWidth - scrollBar) / 2 - left - width / 2;
        const wrapY = -top + (screenHeight - height) / 2;
        const bg = document.createElement("div");
        const zoomContainer = document.createElement("div");
        const imageClone = document.createElement("img");
        let maxWidth = width;
        zoomContainer.append(bg);
        zoomContainer.style.top = `${top + window.scrollY}px`;
        zoomContainer.style.left = `${left}px`;
        zoomContainer.style.width = `${width}px`;
        zoomContainer.style.height = `${height}px`;
        document.body.append(zoomContainer);
        bg.classList.add("zoom__bg");
        bg.style.width = `${screenWidth}px`;
        // Add 0.2px beacuse the browser might make 0.1px gap between window and background layer.
        bg.style.height = `${screenHeight + 0.2}px`;
        bg.style.top = `${-halfY - 0.1}px`;
        // Add image.offsetsLeft because the image’s parent element’s width might be fixed
        bg.style.left = `${-halfX}px`;
        if (background) {
            if (background === "auto") {
                const average = getAverageRGB(image);
                bg.style.background = average
                    ? `rgba(${average.r}, ${average.g}, ${average.b}, 0.95)`
                    : "rgba(0,0,0,.95)";
            } else {
                bg.style.background = background;
            }
        }
        zoomContainer.classList.add("zoom");
        zoomContainer.append(imageClone);
        const regex = /[0-9]+w/gm;
        if (height <= screenHeight && srcset) {
            const sizes = srcset.match(regex);
            if (sizes) {
                const ratio = height / width;
                // Find image's largest width in 'srcset' attribtue
                maxWidth =
                    screenWidth > width
                        ? +sizes.reduce((a, b) => {
                              return `${Math.max(
                                  +a.replace("w", ""),
                                  +b.replace("w", "")
                              )}`;
                          })
                        : width;
                // Image's width shouldn't be larger than screen width
                maxWidth >= screenWidth && (maxWidth = screenWidth);
                // And height too
                const maxHeight = maxWidth * ratio;
                maxHeight >= screenHeight &&
                    (maxWidth = (maxWidth * screenHeight) / maxHeight);
            }
        }
        imageClone.classList.add("zoom__img");
        imageClone.src = src;
        imageClone.srcset = srcset;
        imageClone.width = width;
        imageClone.height = height;
        setTimeout(() => {
            const originalImage = originalizer(src);
            // hide original image
            image.style.opacity = "0";
            // reveal and center cloned image
            zoomContainer.style.transform = `translate3d(${wrapX}px, ${wrapY}px, 0)`;
            bg.classList.add("zoom__bg--reveal");
            // scale up if needed
            if (maxWidth !== width) {
                imageClone.style.transform = `scale(${maxWidth / width})`;
            }
            if (height > screenHeight) {
                imageClone.style.transform = `scale(${screenHeight / height})`;
            }
            // replace image's source to original source
            imageClone.src = originalImage;
            imageClone.srcset = "";
        }, 30);
        const removeImage = () => {
            zoomContainer.classList.add("zoom--removing");
            bg.removeAttribute("style");
            zoomContainer.style.transform = "";
            imageClone.removeAttribute("style");
            setTimeout(() => {
                zoomContainer.remove();
                image.style.opacity = "";
            }, 300);
            window.removeEventListener("scroll", removeImage);
        };
        zoomContainer.addEventListener("click", removeImage, {
            once: true,
        });
        window.addEventListener("scroll", removeImage, { once: true });
    };
    const handleClick = (event) => {
        zoom(event.target);
    };
    const getAverageRGB = (img) => {
        const blockSize = 5;
        const rgb = { r: 0, g: 0, b: 0 };
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
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
            return null;
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
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize, { passive: true });
    document.querySelectorAll(selector).forEach((element) => {
        if (element.tagName === "IMG") {
            element.addEventListener("click", handleClick);
        } else {
            const childImg = element.querySelector("img");
            if (childImg) {
                childImg.addEventListener("click", handleClick);
            }
        }
    });
}
