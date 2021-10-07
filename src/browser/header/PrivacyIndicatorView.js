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
exports.PrivacyIndicatorView = void 0;
var React = require("react");
var ToolbarButton_1 = require("../../browser/bothBars/ToolbarButton");
// https://github.com/cliqz/user-agent-ios/blob/7a91b5ea3e2fbb8b95dadd4f0cfd71b334e73449/UserAgent/Views/Privacy%20Indicator/PrivacyIndicatorView.swift
var PrivacyIndicatorView = /** @class */ (function (_super) {
    __extends(PrivacyIndicatorView, _super);
    function PrivacyIndicatorView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PrivacyIndicatorView.prototype.render = function () {
        var rest = __rest(this.props, []);
        return (<ToolbarButton_1.ToolbarButton name={"circle-notch"} {...rest}/>
        // <$StackLayout>
        //     {/* stub for canvasView, which is that donut graph. */}
        //     <$ContentView/>
        //     <$Button/>
        // </$StackLayout>
        );
    };
    return PrivacyIndicatorView;
}(React.Component));
exports.PrivacyIndicatorView = PrivacyIndicatorView;
