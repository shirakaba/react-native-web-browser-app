import * as React from "react";
import { DEFAULT_HEADER_RETRACTED_HEIGHT, DEFAULT_HEADER_REVEALED_HEIGHT } from "./header/TabLocationView";
import { DEFAULT_FOOTER_REVEALED_HEIGHT } from "./footer/Footer";
import { BarAwareWebViewType, DefaultBarAwareWebView } from "./webView/BarAwareWebView";
import { defaultTabToolbar, TabToolbarType } from "./footer/TabToolbar";
import { defaultHeader, HeaderType } from "./header/Header";
import { GradientProgressBarType, defaultGradientProgressBar } from "./header/GradientProgressBar";
import { BarConfig, RetractionStyle } from "./bothBars/BarConfig";

export interface HeaderConfig extends BarConfig {
    HEADER_RETRACTED_HEIGHT?: number,
    HEADER_REVEALED_HEIGHT?: number,
    HEADER_HIDDEN_HEIGHT?: number,
    portraitRetraction: RetractionStyle,
    landscapeRetraction: RetractionStyle,
    textFieldTextColor?: string,
    buttonEnabledColor?: string,
    buttonDisabledColor?: string,
    slotBackgroundColor?: string,
    textFieldBackgroundColor?: string,
    contentView?: HeaderType;
    progressBar?: GradientProgressBarType,
}

/**
 * References are made to the header retraction/reveal heights because the footer
 * is designed to retract at exactly the same rate as the header does.
 */
export interface FooterConfig extends BarConfig {
    buttonEnabledColor?: string,
    buttonDisabledColor?: string,
    HEADER_RETRACTED_HEIGHT?: number,
    HEADER_REVEALED_HEIGHT?: number,
    FOOTER_REVEALED_HEIGHT: number,
    portraitRetraction: RetractionStyle.alwaysRevealed|RetractionStyle.retractToHidden|RetractionStyle.alwaysHidden,
    landscapeRetraction: RetractionStyle.alwaysRevealed|RetractionStyle.retractToHidden|RetractionStyle.alwaysHidden,
    contentView?: TabToolbarType;
}



export interface BrowserConfig {
    header: HeaderConfig,
    footer: FooterConfig,
    barAwareWebView?: BarAwareWebViewType,
}

export const defaultConfig: BrowserConfig = {
    header: {
        HEADER_RETRACTED_HEIGHT: DEFAULT_HEADER_RETRACTED_HEIGHT,
        HEADER_REVEALED_HEIGHT: DEFAULT_HEADER_REVEALED_HEIGHT,
        portraitRetraction: RetractionStyle.retractToCompact,
        landscapeRetraction: RetractionStyle.retractToHidden,
        backgroundColor: "gray",
        slotBackgroundColor: "darkgray",
        textFieldTextColor: "black",
        textFieldBackgroundColor: "transparent",
        // contentView: (props: HeaderProps) => null,
        contentView: defaultHeader,
        // progressBar: (props: GradientProgressBarOwnProps) => null,
        progressBar: defaultGradientProgressBar,
    },
    footer: {
        HEADER_RETRACTED_HEIGHT: DEFAULT_HEADER_RETRACTED_HEIGHT,
        HEADER_REVEALED_HEIGHT: DEFAULT_HEADER_REVEALED_HEIGHT,
        FOOTER_REVEALED_HEIGHT: DEFAULT_FOOTER_REVEALED_HEIGHT,
        portraitRetraction: RetractionStyle.retractToHidden,
        landscapeRetraction: RetractionStyle.alwaysHidden,
        backgroundColor: "gray",
        // contentView: (props: TabToolbarProps) => null,
        contentView: defaultTabToolbar,
    },
    barAwareWebView: DefaultBarAwareWebView,
};