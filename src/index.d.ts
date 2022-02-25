export default function Zoom(
    selector?: string | HTMLElement | NodeList | HTMLElement[],
    options?: {
        background?: string;
        onTransitionEnd?: (img: HTMLImageElement) => void;
    }
): {
    zoom: (img: HTMLImageElement) => void;
    attach: (target: string | HTMLElement | NodeList | HTMLElement[]) => void;
};
