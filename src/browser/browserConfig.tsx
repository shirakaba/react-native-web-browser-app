import * as React from "react";
import { DEFAULT_HEADER_RETRACTED_HEIGHT, DEFAULT_HEADER_REVEALED_HEIGHT } from "./header/TabLocationView";
import { DEFAULT_FOOTER_REVEALED_HEIGHT } from "./footer/Footer";
import { BarAwareWebViewType, DefaultBarAwareWebView } from "./webView/BarAwareWebView";
import { defaultTabToolbar, TabToolbarType } from "./footer/TabToolbar";
import { defaultHeader, HeaderType } from "./header/Header";

export enum RetractionStyle {
    alwaysRevealed = "alwaysRevealed",
    alwaysCompact = "alwaysCompact",
    alwaysHidden = "alwaysHidden",
    /* Displays text and icons but not buttons, which would be too small to tap */
    retractToCompact = "retractToCompact",
    retractToHidden = "retractToHidden",
}

export interface BarConfig {
    buttons: {
        portrait: [],
        landscape: [],
    },
    portraitRetraction: RetractionStyle,
    landscapeRetraction: RetractionStyle,
    backgroundColor?: string,
}

export interface HeaderConfig extends BarConfig {
    HEADER_RETRACTED_HEIGHT?: number,
    HEADER_REVEALED_HEIGHT?: number,
    HEADER_HIDDEN_HEIGHT?: number,
    buttons: {
        portrait: [],
        landscape: [],
    },
    portraitRetraction: RetractionStyle,
    landscapeRetraction: RetractionStyle,
    slotBackgroundColor?: string,
    textFieldBackgroundColor?: string,
    contentView?: HeaderType;
}

/**
 * References are made to the header retraction/reveal heights because the footer
 * is designed to retract at exactly the same rate as the header does.
 */
export interface FooterConfig extends BarConfig {
    HEADER_RETRACTED_HEIGHT?: number,
    HEADER_REVEALED_HEIGHT?: number,
    FOOTER_REVEALED_HEIGHT: number,
    buttons: {
        portrait: [],
        landscape: [],
    },
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
        buttons: {
            portrait: [],
            landscape: [],
        },
        portraitRetraction: RetractionStyle.retractToCompact,
        landscapeRetraction: RetractionStyle.retractToHidden,
        backgroundColor: "gray",
        slotBackgroundColor: "darkgray",
        textFieldBackgroundColor: "transparent",
        // ContentView: (props: HeaderProps) => null,
        contentView: defaultHeader,
    },
    footer: {
        HEADER_RETRACTED_HEIGHT: DEFAULT_HEADER_RETRACTED_HEIGHT,
        HEADER_REVEALED_HEIGHT: DEFAULT_HEADER_REVEALED_HEIGHT,
        FOOTER_REVEALED_HEIGHT: DEFAULT_FOOTER_REVEALED_HEIGHT,
        buttons: {
            portrait: [],
            landscape: [],
        },
        portraitRetraction: RetractionStyle.retractToHidden,
        landscapeRetraction: RetractionStyle.alwaysHidden,
        backgroundColor: "gray",
        // ContentView: (props: TabToolbarProps) => null,
        contentView: defaultTabToolbar,
    },
    barAwareWebView: DefaultBarAwareWebView,
};