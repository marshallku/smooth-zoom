export default function Zoom(
    selector?: string | HTMLElement | NodeList | Array<HTMLElement>,
    options?: {
        background?: string;
        useMaximumSize?: boolean;
        onClick?: (img: HTMLImageElement) => void;
        onTransitionEnd?: (img: HTMLImageElement) => void;
    }
): {
    zoom: (img: HTMLImageElement) => void;
    attach: (
        target: string | HTMLElement | NodeList | Array<HTMLElement>
    ) => void;
};
