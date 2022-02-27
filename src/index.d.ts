export default function Zoom(
    selector?: string | HTMLElement | NodeList | Array<HTMLElement>,
    options?: {
        background?: string;
        onTransitionEnd?: (img: HTMLImageElement) => void;
    }
): {
    zoom: (img: HTMLImageElement) => void;
    attach: (
        target: string | HTMLElement | NodeList | Array<HTMLElement>
    ) => void;
};
