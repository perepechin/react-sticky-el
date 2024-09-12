import React, { CSSProperties, ReactNode } from 'react';
import type { CommonProps } from './types';
export interface Props extends CommonProps {
    /**
     * Class name to be applied to the sticky element when it is fixed.
     * @default {}
     */
    stickyStyle: CSSProperties;
    /**
     * Class name to be applied to the sticky element when it is fixed.
     * @default 'sticky'
     */
    stickyClassName: string;
    /**
     * Class name to be applied to the wrapper element.
     * @default ''
     */
    wrapperClassName: string;
    children?: ReactNode;
}
export declare const defaultProps: {
    stickyClassName: string;
    wrapperClassName: string;
    stickyStyle: {};
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
declare function Sticky(props: Partial<Props>): React.JSX.Element;
export default Sticky;
