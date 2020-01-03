export enum RetractionStyle {
    alwaysRevealed = "alwaysRevealed",
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
}

export interface HeaderConfig extends BarConfig {
    buttons: {
        portrait: [],
        landscape: [],
    },
    portraitRetraction: RetractionStyle,
    landscapeRetraction: RetractionStyle,
}

export interface FooterConfig extends BarConfig {
    buttons: {
        portrait: [],
        landscape: [],
    },
    portraitRetraction: RetractionStyle.alwaysRevealed|RetractionStyle.retractToHidden|RetractionStyle.alwaysHidden,
    landscapeRetraction: RetractionStyle.alwaysRevealed|RetractionStyle.retractToHidden|RetractionStyle.alwaysHidden,
}

export interface BrowserConfig {
    header: HeaderConfig,
    footer: FooterConfig,
    webViewComponent?: React.ReactNode,
}

export const defaultConfig: BrowserConfig = {
    header: {
        buttons: {
            portrait: [],
            landscape: [],
        },
        portraitRetraction: RetractionStyle.retractToCompact,
        landscapeRetraction: RetractionStyle.retractToHidden,
    },
    footer: {
        buttons: {
            portrait: [],
            landscape: [],
        },
        portraitRetraction: RetractionStyle.retractToHidden,

        // May consider promoting this on tablets to alwaysRevealed (requires react-native-device-info to detect).
        landscapeRetraction: RetractionStyle.alwaysHidden,
    }
};