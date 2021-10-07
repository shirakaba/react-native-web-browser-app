"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.__esModule = true;
exports.Header = exports.defaultHeader = void 0;
var React = require("react");
var react_native_1 = require("react-native");
var TopTabsContainer_1 = require("./TopTabsContainer");
var URLBarView_1 = require("./URLBarView");
var TopTabsContainer = /** @class */ (function (_super) {
    __extends(TopTabsContainer, _super);
    function TopTabsContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TopTabsContainer.prototype.render = function () {
        return (<react_native_1.View style={{ flexDirection: 'column' }}>
                <TopTabsContainer_1.TopTabsViewController />
            </react_native_1.View>);
    };
    return TopTabsContainer;
}(React.Component));
var defaultHeader = function (props) { return <Header {...props}/>; };
exports.defaultHeader = defaultHeader;
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L105
// Header used to have a subchild, "UrlBarTopTabsContainer", but that has now been flattened.
var Header = /** @class */ (function (_super) {
    __extends(Header, _super);
    function Header() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Header.prototype.render = function () {
        var _a = this.props, config = _a.config, toolbarIsShowing = _a.toolbarIsShowing, inOverlayMode = _a.inOverlayMode, style = _a.style, children = _a.children, rest = __rest(_a, ["config", "toolbarIsShowing", "inOverlayMode", "style", "children"]);
        return (<react_native_1.View style={react_native_1.StyleSheet.compose({
                flexDirection: 'column',
                justifyContent: "flex-start",
                marginHorizontal: 4
            }, style)} {...rest}>
                {/* urlBar */}
                <URLBarView_1.URLBarView config={config} scrollY={this.props.scrollY} animatedTitleOpacity={this.props.animatedTitleOpacity} animatedNavBarTranslateYLandscape={this.props.animatedNavBarTranslateYLandscape} animatedNavBarTranslateYPortait={this.props.animatedNavBarTranslateYPortrait} inOverlayMode={inOverlayMode} toolbarIsShowing={toolbarIsShowing}/>
                {/* topTabsContainer */}
                <TopTabsContainer />
            </react_native_1.View>);
    };
    return Header;
}(React.Component));
exports.Header = Header;
