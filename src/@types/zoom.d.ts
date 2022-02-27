declare type TAllowedTargets =
    | string
    | HTMLElement
    | NodeList
    | Array<HTMLElement>;

interface IZoomOptions {
    background?: string;
    onTransitionEnd?: (img: HTMLImageElement) => void;
}
