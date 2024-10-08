import { Component, CSSProperties } from "react";
import type { Rect } from "./helpers/rect";
import type { RenderProps } from "./types";
type State = {
    isFixed: boolean;
    height: number;
    wrapperStyles?: CSSProperties;
    holderStyles?: CSSProperties;
};
declare class Sticky extends Component<RenderProps, State> {
    static defaultProps: {
        mode: "top";
        topOffset: number;
        bottomOffset: number;
        isIOSFixEnabled: boolean;
        offsetTransforms: boolean;
        disabled: boolean;
        onFixedToggle: undefined;
        boundaryElement: undefined;
        hideOnBoundaryHit: boolean;
        scrollElement: string;
        dontUpdateHolderHeightWhenSticky: boolean;
    };
    holderEl: HTMLElement | null;
    wrapperEl: HTMLElement | null;
    el: HTMLElement | null;
    scrollEl: Element | Window | Document | null;
    boundaryEl: Element | Window | Document | null;
    disabled: boolean;
    checkPositionIntervalId: ReturnType<typeof setInterval> | null;
    lastMinHeight: number | null;
    state: State;
    holderRef: (holderEl: HTMLElement | null) => void;
    wrapperRef: (wrapperEl: HTMLElement | null) => void;
    checkPosition: () => void;
    isFixed(holderRect: Rect, wrapperRect: Rect, boundaryRect: Rect, scrollRect: Rect): boolean;
    updateScrollEl(): void;
    updateBoundaryEl(): void;
    initialize(): void;
    componentDidUpdate({ scrollElement, boundaryElement, disabled, }: RenderProps): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): import("react").ReactNode;
}
export default Sticky;
