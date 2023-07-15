export type AllowedTarget =
    | string
    | HTMLElement
    | NodeList
    | Array<HTMLElement>
    | null
    | undefined;

export interface ZoomOption {
    background?: string;
    useMaximumSize?: boolean;
    onTransitionEnd?: (img: HTMLImageElement) => void;
    onClick?: (img: HTMLImageElement) => void;
}
