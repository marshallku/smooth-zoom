declare type TAllowedTargets = string | HTMLElement | NodeList | HTMLElement[];

interface IZoomOptions {
    background?: string;
    onTransitionEnd?: (img: HTMLImageElement) => void;
}
