export default function Zoom(
    selector?: string | HTMLElement | NodeList | HTMLElement[],
    options?: {
        originalizer?: (src: string) => string;
        background?: string;
    }
): {
    zoom: (img: HTMLImageElement) => void;
    attach: (target: string | HTMLElement | NodeList | HTMLElement[]) => void;
};
