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
exports.URLBarView = exports.URL_BAR_VIEW_PADDING_VERTICAL = void 0;
var React = require("react");
var react_native_1 = require("react-native");
var AutocompleteTextField_1 = require("../../browser/header/AutocompleteTextField");
var BarButtons_1 = require("../bothBars/BarButtons");
var TabLocationView_1 = require("./TabLocationView");
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/URLBarView.swift#L786
var ToolbarTextField = /** @class */ (function (_super) {
    __extends(ToolbarTextField, _super);
    function ToolbarTextField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Just a themeable AutocompleteTextField
    ToolbarTextField.prototype.render = function () {
        return (<AutocompleteTextField_1.AutocompleteTextField />);
    };
    return ToolbarTextField;
}(React.Component));
// We need a subclass so we can setup the shadows correctly
// This subclass creates a strong shadow on the URLBar
var TabLocationContainerView = /** @class */ (function (_super) {
    __extends(TabLocationContainerView, _super);
    function TabLocationContainerView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabLocationContainerView.prototype.render = function () {
        return (<react_native_1.View>

            </react_native_1.View>);
    };
    return TabLocationContainerView;
}(React.Component));
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/URLBarView.swift#L108
var LocationContainer = /** @class */ (function (_super) {
    __extends(LocationContainer, _super);
    function LocationContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocationContainer.prototype.render = function () {
        return (<TabLocationContainerView />);
    };
    return LocationContainer;
}(React.Component));
exports.URL_BAR_VIEW_PADDING_VERTICAL = 8;
var URLBarView = /** @class */ (function (_super) {
    __extends(URLBarView, _super);
    function URLBarView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            location: "https://www.birchlabs.co.uk"
        };
        return _this;
    }
    URLBarView.prototype.render = function () {
        var _a = this.props, config = _a.config, toolbarIsShowing = _a.toolbarIsShowing, inOverlayMode = _a.inOverlayMode;
        var buttonEnabledColor = config.buttonEnabledColor, buttonDisabledColor = config.buttonDisabledColor;
        var _b = this.state;
        var stackContents;
        if (inOverlayMode) {
            // i.e. URL bar's text field has been focused and the browser displays an overlay over the webpage.
            stackContents = (<>
                    {/* AKA locationTextField */}
                    <ToolbarTextField />
                    <BarButtons_1.CancelButtonConnected />
                </>);
        }
        else if (toolbarIsShowing) {
            // i.e. landscape (so show all the items that the footer would normally handle)
            stackContents = (<>
                    <BarButtons_1.BackButtonConnected enabledColor={buttonEnabledColor} disabledColor={buttonDisabledColor}/>
                    <BarButtons_1.ForwardButtonConnected enabledColor={buttonEnabledColor} disabledColor={buttonDisabledColor}/>
                    <BarButtons_1.StopReloadButtonConnected enabledColor={buttonEnabledColor} disabledColor={buttonDisabledColor}/>
                    {/* AKA locationView. */}
                    <TabLocationView_1.TabLocationViewConnected config={config} scrollY={this.props.scrollY} animatedTitleOpacity={this.props.animatedTitleOpacity} animatedNavBarTranslateYLandscape={this.props.animatedNavBarTranslateYLandscape} animatedNavBarTranslateYPortrait={this.props.animatedNavBarTranslateYPortait}/>
                    <BarButtons_1.TabsButtonConnected enabledColor={buttonEnabledColor} disabledColor={buttonDisabledColor}/>
                    <BarButtons_1.MenuButtonConnected enabledColor={buttonEnabledColor} disabledColor={buttonDisabledColor}/>
                </>);
        }
        else {
            // i.e. portrait (so hide all the items that the footer will be handling)
            stackContents = (<>
                    {/* AKA locationView. */}
                    <TabLocationView_1.TabLocationViewConnected config={config} scrollY={this.props.scrollY} animatedTitleOpacity={this.props.animatedTitleOpacity} animatedNavBarTranslateYLandscape={this.props.animatedNavBarTranslateYLandscape} animatedNavBarTranslateYPortrait={this.props.animatedNavBarTranslateYPortait}/>
                </>);
        }
        return (<react_native_1.View style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                height: "auto",
                width: "100%",
                paddingVertical: exports.URL_BAR_VIEW_PADDING_VERTICAL
            }}>
                {stackContents}
            </react_native_1.View>);
    };
    return URLBarView;
}(React.Component));
exports.URLBarView = URLBarView;
