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
exports.GradientProgressBarConnected = exports.GRADIENT_PROGRESS_BAR_HEIGHT = exports.defaultGradientProgressBar = void 0;
var React = require("react");
var react_redux_1 = require("react-redux");
var react_native_1 = require("react-native");
var defaultGradientProgressBar = function (props) { return <exports.GradientProgressBarConnected {...props}/>; };
exports.defaultGradientProgressBar = defaultGradientProgressBar;
exports.GRADIENT_PROGRESS_BAR_HEIGHT = 2;
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift
var GradientProgressBar = /** @class */ (function (_super) {
    __extends(GradientProgressBar, _super);
    function GradientProgressBar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            barWidth: new react_native_1.Animated.Value(props.progress),
            barOpacity: new react_native_1.Animated.Value(props.progress === 1 ? 0 : 1)
        };
        return _this;
    }
    GradientProgressBar.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
        // console.log(`[GradientProgressBar] shouldComponentUpdate with this.props.progress ${this.props.progress}, nextProps.progress ${nextProps.progress},`);
        if (this.props.progress !== nextProps.progress) {
            if (nextProps.progress === 1) {
                nextState.barOpacity.stopAnimation(function () {
                    react_native_1.Animated.timing(nextState.barOpacity, {
                        toValue: 0,
                        duration: 500
                    })
                        .start();
                });
            }
            if (nextProps.progress < this.props.progress) {
                nextState.barWidth.stopAnimation(function () {
                    nextState.barWidth.setValue(nextProps.progress);
                    nextState.barOpacity.setValue(1);
                });
            }
            else {
                nextState.barWidth.stopAnimation(function () {
                    react_native_1.Animated.timing(nextState.barWidth, {
                        toValue: nextProps.progress,
                        duration: 10
                    })
                        .start();
                });
            }
        }
        return true;
    };
    GradientProgressBar.prototype.render = function () {
        var _a = this.props, progress = _a.progress, _b = _a.trackColor, trackColor = _b === void 0 ? "blue" : _b, rest = __rest(_a, ["progress", "trackColor"]);
        // console.log(`[GradientProgressBar] rendering with progress ${progress}`);
        return (<react_native_1.Animated.View style={{
                flexDirection: "row",
                // Or is it justifyContent?
                alignItems: "flex-start",
                width: "100%",
                height: "auto",
                backgroundColor: "transparent"
            }} 
        // This is declared in app/components/AppContainer.scss
        // className={progress === 1 ? "fade-out-anim" : ""}
        {...rest}>
                <react_native_1.Animated.View style={{
                height: exports.GRADIENT_PROGRESS_BAR_HEIGHT,
                backgroundColor: trackColor,
                width: this.state.barWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                }),
                opacity: this.state.barOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                })
            }}/>
            </react_native_1.Animated.View>);
    };
    return GradientProgressBar;
}(React.Component));
exports.GradientProgressBarConnected = (0, react_redux_1.connect)(function (wholeStoreState) {
    // console.log(`wholeStoreState`, wholeStoreState);
    var _a = wholeStoreState.navigation, activeTab = _a.activeTab, tabs = _a.tabs;
    return {
        progress: tabs[activeTab].loadProgress
    };
}, {})(GradientProgressBar);
