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
exports.TabToolbar = exports.defaultTabToolbar = void 0;
var React = require("react");
var react_native_1 = require("react-native");
var BarButtons_1 = require("../bothBars/BarButtons");
var defaultTabToolbar = function (props) { return <TabToolbar {...props}/>; };
exports.defaultTabToolbar = defaultTabToolbar;
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabToolbar.swift#L199
var TabToolbar = /** @class */ (function (_super) {
    __extends(TabToolbar, _super);
    function TabToolbar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabToolbar.prototype.render = function () {
        var _a = this.props, config = _a.config, containerStyle = _a.containerStyle, rest = __rest(_a, ["config", "containerStyle"]);
        var buttonEnabledColor = config.buttonEnabledColor, buttonDisabledColor = config.buttonDisabledColor;
        return (<react_native_1.View style={[
                {
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                    paddingTop: 16
                },
                containerStyle
            ]} {...rest}>
                {/* actionButtons */}
                <BarButtons_1.BackButtonConnected enabledColor={buttonEnabledColor} disabledColor={buttonDisabledColor}/>
                <BarButtons_1.ForwardButtonConnected enabledColor={buttonEnabledColor} disabledColor={buttonDisabledColor}/>
                <BarButtons_1.MenuButtonConnected enabledColor={buttonEnabledColor} disabledColor={buttonDisabledColor}/>
                <BarButtons_1.SearchButtonConnected enabledColor={buttonEnabledColor} disabledColor={buttonDisabledColor}/>
                <BarButtons_1.TabsButtonConnected enabledColor={buttonEnabledColor} disabledColor={buttonDisabledColor}/>
            </react_native_1.View>);
    };
    return TabToolbar;
}(React.Component));
exports.TabToolbar = TabToolbar;
