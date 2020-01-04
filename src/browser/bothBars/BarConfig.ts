export enum RetractionStyle {
    alwaysRevealed = "alwaysRevealed",
    alwaysCompact = "alwaysCompact",
    alwaysHidden = "alwaysHidden",
    /* Displays text and icons but not buttons, which would be too small to tap */
    retractToCompact = "retractToCompact",
    retractToHidden = "retractToHidden"
}
export interface BarConfig {
    portraitRetraction: RetractionStyle;
    landscapeRetraction: RetractionStyle;
    backgroundColor?: string;
}
