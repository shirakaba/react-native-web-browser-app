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
exports.AutocompleteTextField = void 0;
var React = require("react");
var react_native_1 = require("react-native");
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Widgets/AutocompleteTextField.swift
var AutocompleteTextField = /** @class */ (function (_super) {
    __extends(AutocompleteTextField, _super);
    function AutocompleteTextField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutocompleteTextField.prototype.render = function () {
        return (<react_native_1.TextInput />);
    };
    return AutocompleteTextField;
}(React.Component));
exports.AutocompleteTextField = AutocompleteTextField;
