"use strict";
// @flow strict
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const events_1 = require("./helpers/events");
const find_1 = __importDefault(require("./helpers/find"));
const getClosestTransformedParent_1 = __importDefault(require("./helpers/getClosestTransformedParent"));
const rect_1 = require("./helpers/rect");
const buildTopStyles = (container, props) => {
    const { bottomOffset, hideOnBoundaryHit } = props;
    const { top, height, width, boundaryBottom } = container;
    // above boundary
    if (hideOnBoundaryHit || top + height + bottomOffset < boundaryBottom) {
        return { top: `${top}px`, width: `${width}px`, position: "fixed" };
    }
    // reaching boundary
    if (!hideOnBoundaryHit && boundaryBottom > 0) {
        return {
            top: `${boundaryBottom - height - bottomOffset}px`,
            width: `${width}px`,
            position: "fixed",
        };
    }
    // below boundary
    return {
        width: `${width}px`,
        bottom: `${bottomOffset}px`,
        position: "absolute",
    };
};
const buildBottomStyles = (container, props) => {
    const { bottomOffset, hideOnBoundaryHit } = props;
    const { bottom, height, width, boundaryTop } = container;
    if (hideOnBoundaryHit || bottom - height - bottomOffset > boundaryTop) {
        return {
            width: `${width}px`,
            top: `${bottom - height}px`,
            position: "fixed",
        };
    }
    return {
        width: `${width}px`,
        top: `${bottomOffset}px`,
        position: "absolute",
    };
};
const buildStickyStyle = (mode, props, container) => (mode === "top" ? buildTopStyles : buildBottomStyles)(container, props);
const isEqual = (obj1, obj2) => {
    const styles1 = obj1.wrapperStyles;
    const styles2 = obj2.wrapperStyles;
    if (obj1.isFixed !== obj2.isFixed ||
        obj1.height !== obj2.height ||
        (!styles1 && styles2) ||
        (styles1 && !styles2)) {
        return false;
    }
    if (!styles2) {
        return true;
    }
    for (const field in styles1) {
        // @ts-expect-error - ts doesn't like that `field` is a string
        // eslint-disable-next-line no-prototype-builtins
        if (styles1.hasOwnProperty(field) && styles1[field] !== styles2[field]) {
            return false;
        }
    }
    return true;
};
class Sticky extends react_1.Component {
    constructor() {
        super(...arguments);
        this.holderEl = null;
        this.wrapperEl = null;
        this.el = null;
        this.scrollEl = null;
        this.boundaryEl = null;
        this.disabled = false;
        this.checkPositionIntervalId = null;
        this.lastMinHeight = null;
        this.state = {
            isFixed: false,
            wrapperStyles: undefined,
            holderStyles: undefined,
            height: 0,
        };
        this.holderRef = (holderEl) => {
            if (holderEl === this.holderEl) {
                return;
            }
            this.holderEl = holderEl;
        };
        this.wrapperRef = (wrapperEl) => {
            if (wrapperEl === this.wrapperEl) {
                return;
            }
            this.wrapperEl = wrapperEl;
            this.updateScrollEl();
            this.updateBoundaryEl();
        };
        this.checkPosition = () => {
            const { holderEl, wrapperEl, boundaryEl, scrollEl, disabled } = this;
            if (!scrollEl || !holderEl || !wrapperEl) {
                console.error("Missing required elements:", {
                    scrollEl,
                    holderEl,
                    wrapperEl,
                });
                return;
            }
            const { mode, onFixedToggle, offsetTransforms, isIOSFixEnabled, dontUpdateHolderHeightWhenSticky, } = this.props;
            if (disabled) {
                if (this.state.isFixed) {
                    this.setState({ isFixed: false, wrapperStyles: {} });
                }
                return;
            }
            if (!holderEl.getBoundingClientRect || !wrapperEl.getBoundingClientRect) {
                return;
            }
            const holderRect = holderEl.getBoundingClientRect();
            const wrapperRect = wrapperEl.getBoundingClientRect();
            const boundaryRect = boundaryEl ? (0, rect_1.getRect)(boundaryEl) : rect_1.infiniteRect;
            const scrollRect = (0, rect_1.getRect)(scrollEl);
            const isFixed = this.isFixed(holderRect, wrapperRect, boundaryRect, scrollRect);
            let offsets = null;
            if (offsetTransforms && isFixed && scrollEl instanceof HTMLElement) {
                const closestTransformedParent = (0, getClosestTransformedParent_1.default)(scrollEl);
                if (closestTransformedParent) {
                    offsets = (0, rect_1.getRect)(closestTransformedParent);
                }
            }
            const minHeight = this.state.isFixed &&
                dontUpdateHolderHeightWhenSticky &&
                this.lastMinHeight
                ? this.lastMinHeight
                : wrapperRect.height;
            this.lastMinHeight = minHeight;
            // To ensure that this component becomes sticky immediately on mobile devices instead
            // of disappearing until the scroll event completes, we add `transform: translateZ(0)`
            // to 'kick' rendering of this element to the GPU
            // @see http://stackoverflow.com/questions/32875046
            const iosRenderingFixStyles = isIOSFixEnabled
                ? {
                    transform: "translateZ(0)",
                    WebkitTransform: "translateZ(0)",
                }
                : undefined;
            const newState = {
                isFixed,
                height: wrapperRect.height,
                holderStyles: { minHeight: `${minHeight}px` },
                wrapperStyles: isFixed
                    ? Object.assign(Object.assign({}, iosRenderingFixStyles), buildStickyStyle(mode, this.props, {
                        boundaryTop: mode === "bottom" ? boundaryRect.top : 0,
                        boundaryBottom: mode === "top" ? boundaryRect.bottom : 0,
                        top: mode === "top"
                            ? scrollRect.top - (offsets ? offsets.top : 0)
                            : 0,
                        bottom: mode === "bottom"
                            ? scrollRect.bottom - (offsets ? offsets.bottom : 0)
                            : 0,
                        width: holderRect.width,
                        height: wrapperRect.height,
                    })) : iosRenderingFixStyles,
            };
            if (isFixed !== this.state.isFixed &&
                onFixedToggle &&
                typeof onFixedToggle === "function") {
                onFixedToggle(isFixed);
            }
            if (!isEqual(this.state, newState)) {
                this.setState(newState);
            }
        };
    }
    isFixed(holderRect, wrapperRect, boundaryRect, scrollRect) {
        const { hideOnBoundaryHit, bottomOffset, topOffset, mode } = this.props;
        if (this.disabled) {
            return false;
        }
        if (hideOnBoundaryHit &&
            boundaryRect &&
            !(0, rect_1.isIntersecting)(boundaryRect, scrollRect, topOffset, bottomOffset)) {
            return false;
        }
        const hideOffset = hideOnBoundaryHit
            ? wrapperRect.height + bottomOffset
            : 0;
        if (mode === "top") {
            return (holderRect.top + topOffset < scrollRect.top &&
                scrollRect.top + hideOffset <= boundaryRect.bottom);
        }
        return (holderRect.bottom - topOffset > scrollRect.bottom &&
            scrollRect.bottom - hideOffset >= boundaryRect.top);
    }
    updateScrollEl() {
        if (!this.wrapperEl) {
            return;
        }
        if (this.scrollEl) {
            (0, events_1.unlisten)(this.scrollEl, ["scroll"], this.checkPosition);
            this.scrollEl = null;
        }
        const { scrollElement } = this.props;
        if (typeof scrollElement === "string") {
            this.scrollEl = (0, find_1.default)(scrollElement, this.wrapperEl);
        }
        else {
            this.scrollEl = scrollElement;
        }
        if (this.scrollEl) {
            (0, events_1.listen)(this.scrollEl, ["scroll"], this.checkPosition);
        }
        else {
            console.error("Cannot find scrollElement " +
                (typeof scrollElement === "string" ? scrollElement : "unknown"));
        }
    }
    updateBoundaryEl() {
        if (!this.wrapperEl) {
            return;
        }
        const { boundaryElement } = this.props;
        this.boundaryEl = (0, find_1.default)(boundaryElement, this.wrapperEl);
        if (this.boundaryEl === window || this.boundaryEl === document) {
            // such objects can't be used as boundary
            // and in fact there is no point in such a case
            this.boundaryEl = null;
        }
    }
    initialize() {
        const { positionRecheckInterval, disabled } = this.props;
        this.disabled = disabled;
        // we should always listen to window events because they will affect the layout of the whole page
        (0, events_1.listen)(window, ["scroll", "resize", "pageshow", "load"], this.checkPosition);
        if (!this.scrollEl || !this.holderEl || !this.wrapperEl) {
            this.checkPosition();
        }
        if (positionRecheckInterval) {
            this.checkPositionIntervalId = setInterval(this.checkPosition, positionRecheckInterval);
        }
    }
    componentDidUpdate({ scrollElement, boundaryElement, disabled, }) {
        if (scrollElement !== this.props.scrollElement || this.scrollEl === null) {
            this.updateScrollEl();
        }
        if (boundaryElement !== this.props.boundaryElement ||
            this.boundaryEl === null) {
            this.updateBoundaryEl();
        }
        if (disabled !== this.props.disabled) {
            this.disabled = this.props.disabled;
            this.checkPosition();
        }
    }
    componentDidMount() {
        this.initialize();
        if (this.wrapperEl === null) {
            console.error("Wrapper element is missing, please make sure that you have assigned refs correctly");
        }
    }
    componentWillUnmount() {
        if (this.scrollEl) {
            (0, events_1.unlisten)(this.scrollEl, ["scroll"], this.checkPosition);
        }
        (0, events_1.unlisten)(window, ["scroll", "resize", "pageshow", "load"], this.checkPosition);
        this.boundaryEl = null;
        this.scrollEl = null;
        if (this.checkPositionIntervalId) {
            clearInterval(this.checkPositionIntervalId);
        }
    }
    render() {
        const { holderRef, wrapperRef } = this;
        const { isFixed, wrapperStyles, holderStyles } = this.state;
        return this.props.children({
            holderRef,
            wrapperRef,
            isFixed,
            wrapperStyles,
            holderStyles,
        });
    }
}
Sticky.defaultProps = {
    mode: "top",
    topOffset: 0,
    bottomOffset: 0,
    isIOSFixEnabled: true,
    offsetTransforms: true,
    disabled: false,
    onFixedToggle: undefined,
    boundaryElement: undefined,
    hideOnBoundaryHit: true,
    scrollElement: "window",
    dontUpdateHolderHeightWhenSticky: false,
};
exports.default = Sticky;
