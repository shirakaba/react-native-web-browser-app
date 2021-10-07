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
exports.BrowserViewControllerConnected = exports.BrowserViewController = void 0;
var React = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var react_redux_1 = require("react-redux");
var browserConfig_1 = require("./browserConfig");
var uiState_1 = require("../store/uiState");
var barSpring_1 = require("./bothBars/barSpring");
var Footer_1 = require("./footer/Footer");
var RetractibleHeader_1 = require("./header/RetractibleHeader");
var TabLocationView_1 = require("./header/TabLocationView");
var BarAwareWebView_1 = require("./webView/BarAwareWebView");
var WebViewBackdrop_1 = require("./webView/WebViewBackdrop");
var BrowserViewControllerUX = {
    ShowHeaderTapAreaHeight: 0,
    BookmarkStarAnimationDuration: 0.5,
    BookmarkStarAnimationOffset: 80
};
var BrowserViewController = /** @class */ (function (_super) {
    __extends(BrowserViewController, _super);
    function BrowserViewController(props) {
        var _this = _super.call(this, props) || this;
        _this.scrollEndDragVelocity = new react_native_reanimated_1["default"].Value(barSpring_1.DRAG_END_INITIAL);
        _this.onOrientationChange = function () {
            _this.props.updateOrientation((0, uiState_1.isPortrait)() ? 'portrait' : 'landscape');
        };
        var _a = props.config, config = _a === void 0 ? browserConfig_1.defaultConfig : _a;
        var _b = config.header, _c = _b.HEADER_RETRACTED_HEIGHT, HEADER_RETRACTED_HEIGHT = _c === void 0 ? TabLocationView_1.DEFAULT_HEADER_RETRACTED_HEIGHT : _c, _d = _b.HEADER_REVEALED_HEIGHT, HEADER_REVEALED_HEIGHT = _d === void 0 ? TabLocationView_1.DEFAULT_HEADER_REVEALED_HEIGHT : _d;
        var HEADER_RETRACTION_DISTANCE = HEADER_REVEALED_HEIGHT - HEADER_RETRACTED_HEIGHT;
        _this.scrollY = new react_native_reanimated_1["default"].Value(HEADER_RETRACTION_DISTANCE);
        return _this;
    }
    BrowserViewController.prototype.componentDidMount = function () {
        react_native_1.Dimensions.addEventListener('change', this.onOrientationChange);
    };
    BrowserViewController.prototype.componentWillUnmount = function () {
        react_native_1.Dimensions.removeEventListener('change', this.onOrientationChange);
    };
    BrowserViewController.prototype.render = function () {
        var _a = this.props.config, config = _a === void 0 ? browserConfig_1.defaultConfig : _a;
        var _b = config.barAwareWebView, barAwareWebView = _b === void 0 ? BarAwareWebView_1.DefaultBarAwareWebView : _b;
        // Visibility of certain components changes when switching app (if in private browsing mode)
        // https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L343
        return (<react_native_1.View 
        // stretchLastChild={true}
        style={{
                flex: 1,
                flexDirection: 'column',
                width: '100%',
                height: '100%'
            }}>
        <RetractibleHeader_1.RetractibleHeaderConnected config={config.header} scrollY={this.scrollY}/>

        <react_native_1.View style={{
                flex: 1,
                width: '100%',
                height: '100%',
                flexGrow: 1,
                alignItems: 'center',
                backgroundColor: 'green',
                flexDirection: 'column'
            }}>
          <react_native_1.View style={{
                flex: 1,
                flexDirection: 'column',
                width: '100%'
            }}>
            <WebViewBackdrop_1.WebViewBackdrop style={{
                backgroundColor: 'gold',
                position: 'absolute'
            }}/>
            {barAwareWebView({
                headerConfig: config.header,
                scrollY: this.scrollY,
                scrollEndDragVelocity: this.scrollEndDragVelocity
            })}
          </react_native_1.View>

          <Footer_1.FooterConnected config={config.footer} scrollY={this.scrollY} showToolbar={true}/>
        </react_native_1.View>
      </react_native_1.View>);
    };
    return BrowserViewController;
}(React.Component));
exports.BrowserViewController = BrowserViewController;
exports.BrowserViewControllerConnected = (0, react_redux_1.connect)(function (wholeStoreState) {
    // console.log(`wholeStoreState`, wholeStoreState);
    return {};
}, {
    updateOrientation: uiState_1.updateOrientation
})(BrowserViewController);
