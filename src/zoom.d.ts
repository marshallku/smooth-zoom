export default function Zoom(
    selector: string | HTMLElement | NodeList,
    options?: {
        originalizer?: (src: string) => string;
        background?: string;
    }
): void;
