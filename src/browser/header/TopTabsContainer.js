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
exports.__esModule = true;
exports.TopTabsContainer = exports.TopTabsViewController = void 0;
var React = require("react");
var react_native_1 = require("react-native");
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TopTabsViewController.swift
// Just a stub for now.
var TopTabsViewController = /** @class */ (function (_super) {
    __extends(TopTabsViewController, _super);
    function TopTabsViewController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TopTabsViewController.prototype.render = function () {
        return (
        // UIViewController().view
        <react_native_1.View>
                {/* topTabFader */}
                {/* tabsButton */}
                {/* newTab */}
                {/* privateModeButton */}
            </react_native_1.View>);
    };
    return TopTabsViewController;
}(React.Component));
exports.TopTabsViewController = TopTabsViewController;
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L128
var TopTabsContainer = /** @class */ (function (_super) {
    __extends(TopTabsContainer, _super);
    function TopTabsContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TopTabsContainer.prototype.render = function () {
        return (
        // UIView()
        <react_native_1.View style={{ flexDirection: "column" }}>
                {/* topTabsViewController.view */}
                <TopTabsViewController />
            </react_native_1.View>);
    };
    return TopTabsContainer;
}(React.Component));
exports.TopTabsContainer = TopTabsContainer;
