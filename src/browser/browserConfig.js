"use strict";
exports.__esModule = true;
exports.defaultConfig = void 0;
var TabLocationView_1 = require("./header/TabLocationView");
var Footer_1 = require("./footer/Footer");
var BarAwareWebView_1 = require("./webView/BarAwareWebView");
var TabToolbar_1 = require("./footer/TabToolbar");
var Header_1 = require("./header/Header");
var GradientProgressBar_1 = require("./header/GradientProgressBar");
var BarConfig_1 = require("./bothBars/BarConfig");
exports.defaultConfig = {
    header: {
        HEADER_RETRACTED_HEIGHT: TabLocationView_1.DEFAULT_HEADER_RETRACTED_HEIGHT,
        HEADER_REVEALED_HEIGHT: TabLocationView_1.DEFAULT_HEADER_REVEALED_HEIGHT,
        portraitRetraction: BarConfig_1.RetractionStyle.retractToCompact,
        landscapeRetraction: BarConfig_1.RetractionStyle.retractToHidden,
        progressBarTrackColor: "blue",
        backgroundColor: "gray",
        slotBackgroundColor: "darkgray",
        textFieldTextColor: "black",
        textFieldBackgroundColor: "transparent",
        // contentView: (props: HeaderProps) => null,
        contentView: Header_1.defaultHeader,
        // progressBar: (props: GradientProgressBarOwnProps) => null,
        progressBar: GradientProgressBar_1.defaultGradientProgressBar
    },
    footer: {
        HEADER_RETRACTED_HEIGHT: TabLocationView_1.DEFAULT_HEADER_RETRACTED_HEIGHT,
        HEADER_REVEALED_HEIGHT: TabLocationView_1.DEFAULT_HEADER_REVEALED_HEIGHT,
        FOOTER_REVEALED_HEIGHT: Footer_1.DEFAULT_FOOTER_REVEALED_HEIGHT,
        portraitRetraction: BarConfig_1.RetractionStyle.retractToHidden,
        landscapeRetraction: BarConfig_1.RetractionStyle.alwaysHidden,
        backgroundColor: "gray",
        // contentView: (props: TabToolbarProps) => null,
        contentView: TabToolbar_1.defaultTabToolbar
    },
    barAwareWebView: BarAwareWebView_1.DefaultBarAwareWebView
};
