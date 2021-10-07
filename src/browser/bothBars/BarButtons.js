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
exports.CancelButtonConnected = exports.TabsButtonConnected = exports.SearchButtonConnected = exports.MenuButtonConnected = exports.StopReloadButtonConnected = exports.ForwardButtonConnected = exports.BackButtonConnected = void 0;
var React = require("react");
var react_native_1 = require("react-native");
var ToolbarButton_1 = require("./ToolbarButton");
var navigationState_1 = require("../../store/navigationState");
var react_redux_1 = require("react-redux");
var BackButton = /** @class */ (function (_super) {
    __extends(BackButton, _super);
    function BackButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onTap = function () {
            _this.props.goBackOnWebView();
        };
        return _this;
    }
    BackButton.prototype.render = function () {
        var _a = this.props, canGoBack = _a.canGoBack, rest = __rest(_a, ["canGoBack"]);
        return (<ToolbarButton_1.ToolbarButton {...rest} enabled={canGoBack} onTap={this.onTap} name={"chevron-left"}/>);
    };
    return BackButton;
}(React.Component));
exports.BackButtonConnected = (0, react_redux_1.connect)(function (wholeStoreState) {
    // May support pop-out history in future.
    return {
        canGoBack: wholeStoreState.navigation.tabs[wholeStoreState.navigation.activeTab].canGoBack
    };
}, {
    goBackOnWebView: navigationState_1.goBackOnWebView
})(BackButton);
var ForwardButton = /** @class */ (function (_super) {
    __extends(ForwardButton, _super);
    function ForwardButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onTap = function () {
            _this.props.goForwardOnWebView();
        };
        return _this;
    }
    ForwardButton.prototype.render = function () {
        var _a = this.props, canGoForward = _a.canGoForward, rest = __rest(_a, ["canGoForward"]);
        return (<ToolbarButton_1.ToolbarButton {...rest} enabled={canGoForward} onTap={this.onTap} name={"chevron-right"}/>);
    };
    return ForwardButton;
}(React.Component));
exports.ForwardButtonConnected = (0, react_redux_1.connect)(function (wholeStoreState) {
    // May support pop-out history in future.
    return {
        canGoForward: wholeStoreState.navigation.tabs[wholeStoreState.navigation.activeTab].canGoForward
    };
}, {
    goForwardOnWebView: navigationState_1.goForwardOnWebView
})(ForwardButton);
var StopReloadButton = /** @class */ (function (_super) {
    __extends(StopReloadButton, _super);
    function StopReloadButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onTap = function () {
            if (_this.props.loading) {
                _this.props.stopWebView();
            }
            else {
                _this.props.reloadWebView();
            }
        };
        return _this;
    }
    StopReloadButton.prototype.render = function () {
        var _a = this.props, loading = _a.loading, rest = __rest(_a, ["loading"]);
        return (<ToolbarButton_1.ToolbarButton {...rest} onTap={this.onTap} name={loading ?
                // Stop (cross symbol)
                "times" :
                // Reload (redo symbol)
                "redo"}/>);
    };
    return StopReloadButton;
}(React.Component));
exports.StopReloadButtonConnected = (0, react_redux_1.connect)(function (wholeStoreState) {
    var _a = wholeStoreState.navigation, activeTab = _a.activeTab, tabs = _a.tabs;
    // console.log(`[StopReloadButtonConnected] wholeStoreState.navigation`, wholeStoreState.navigation);
    return {
        loading: tabs[activeTab].loadProgress !== 1
    };
}, {
    reloadWebView: navigationState_1.reloadWebView,
    stopWebView: navigationState_1.stopWebView
})(StopReloadButton);
// From TabToolbar
/**
 * Menu refers to the app menu, not a page-specific menu.
 */
var MenuButton = /** @class */ (function (_super) {
    __extends(MenuButton, _super);
    function MenuButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuButton.prototype.render = function () {
        var rest = __rest(this.props, []);
        return (<ToolbarButton_1.ToolbarButton {...rest} name={"ellipsis-v"}/>);
    };
    return MenuButton;
}(React.Component));
exports.MenuButtonConnected = (0, react_redux_1.connect)(function (wholeStoreState) {
    return {};
}, {
// TODO
})(MenuButton);
var SearchButton = /** @class */ (function (_super) {
    __extends(SearchButton, _super);
    function SearchButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearchButton.prototype.render = function () {
        var rest = __rest(this.props, []);
        return (<ToolbarButton_1.ToolbarButton {...rest} name={"search"}/>);
    };
    return SearchButton;
}(React.Component));
exports.SearchButtonConnected = (0, react_redux_1.connect)(function (wholeStoreState) {
    return {};
}, {
// TODO
})(SearchButton);
// https://github.com/cliqz/user-agent-ios/blob/7a91b5ea3e2fbb8b95dadd4f0cfd71b334e73449/Client/Frontend/Browser/TabToolbar.swift#L146
var TabsButton = /** @class */ (function (_super) {
    __extends(TabsButton, _super);
    function TabsButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabsButton.prototype.render = function () {
        var rest = __rest(this.props, []);
        return (<ToolbarButton_1.ToolbarButton {...rest} name={"th-large"}/>);
    };
    return TabsButton;
}(React.Component));
exports.TabsButtonConnected = (0, react_redux_1.connect)(function (wholeStoreState) {
    return {};
}, {
// TODO
})(TabsButton);
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/URLBarView.swift#L136
var CancelButton = /** @class */ (function (_super) {
    __extends(CancelButton, _super);
    function CancelButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CancelButton.prototype.render = function () {
        var rest = __rest(this.props, []);
        return (<react_native_1.TouchableOpacity {...rest}>
                <react_native_1.Text>Cancel</react_native_1.Text>
            </react_native_1.TouchableOpacity>);
    };
    return CancelButton;
}(React.Component));
exports.CancelButtonConnected = (0, react_redux_1.connect)(function (wholeStoreState) {
    return {};
}, {
// TODO
})(CancelButton);
