import { AllowedTarget, ZoomOption } from "./types/zoom";

declare function Zoom(
    selector?: AllowedTarget,
    options?: ZoomOption,
): {
    zoom: (img: HTMLImageElement) => void;
    attach: (target: AllowedTarget) => void;
    detach: (target: AllowedTarget) => void;
};

export default Zoom;
