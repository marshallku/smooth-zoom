declare type AllowedTarget =
    | string
    | HTMLElement
    | NodeList
    | Array<HTMLElement>;

interface ZoomOption {
    background?: string;
    useMaximumSize?: boolean;
    onTransitionEnd?: (img: HTMLImageElement) => void;
    onClick?: (img: HTMLImageElement) => void;
}
