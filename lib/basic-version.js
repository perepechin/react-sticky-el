"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultProps = void 0;
const react_1 = __importDefault(require("react"));
const render_props_version_1 = __importDefault(require("./render-props-version"));
exports.defaultProps = Object.assign(Object.assign({}, render_props_version_1.default.defaultProps), { stickyClassName: 'sticky', wrapperClassName: '', stickyStyle: {} });
function Sticky(props) {
    const _a = Object.assign(Object.assign({}, exports.defaultProps), props), { 
    // props for StickyRenderProp
    mode, onFixedToggle, hideOnBoundaryHit, offsetTransforms, disabled, boundaryElement, scrollElement, bottomOffset, topOffset, positionRecheckInterval, children, isIOSFixEnabled, dontUpdateHolderHeightWhenSticky, 
    // own props
    wrapperClassName, stickyClassName, stickyStyle } = _a, 
    // rest of the props that we will forward to wrapper
    rest = __rest(_a, ["mode", "onFixedToggle", "hideOnBoundaryHit", "offsetTransforms", "disabled", "boundaryElement", "scrollElement", "bottomOffset", "topOffset", "positionRecheckInterval", "children", "isIOSFixEnabled", "dontUpdateHolderHeightWhenSticky", "wrapperClassName", "stickyClassName", "stickyStyle"]);
    return react_1.default.createElement(render_props_version_1.default, { mode: mode, onFixedToggle: onFixedToggle, hideOnBoundaryHit: hideOnBoundaryHit, offsetTransforms: offsetTransforms, disabled: disabled, boundaryElement: boundaryElement, scrollElement: scrollElement, bottomOffset: bottomOffset, topOffset: topOffset, positionRecheckInterval: positionRecheckInterval, isIOSFixEnabled: isIOSFixEnabled, dontUpdateHolderHeightWhenSticky: dontUpdateHolderHeightWhenSticky }, ({ isFixed, wrapperStyles, wrapperRef, holderStyles, holderRef }) => (react_1.default.createElement("div", Object.assign({}, rest, { ref: holderRef, style: holderStyles }),
        react_1.default.createElement("div", Object.assign({}, rest, { className: `${wrapperClassName} ${isFixed ? stickyClassName : ''}`, style: isFixed ? Object.assign(Object.assign({}, wrapperStyles), stickyStyle) : wrapperStyles, ref: wrapperRef }), children))));
}
exports.default = Sticky;
