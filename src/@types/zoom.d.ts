declare type TAllowedTargets =
    | string
    | HTMLElement
    | NodeList
    | Array<HTMLElement>;

interface IZoomOptions {
    background?: string;
    useMaximumSize?: boolean;
    onTransitionEnd?: (img: HTMLImageElement) => void;
    onClick?: (img: HTMLImageElement) => void;
}
