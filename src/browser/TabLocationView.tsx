import * as React from "react";
import { TextInput, TextInputProps, NativeSyntheticEvent, TextInputSubmitEditingEventData, View, ViewProps, TouchableOpacityProps, StyleSheet, StyleProp, TextStyle, processColor } from "react-native";
// import { WebView, ActionBar, StackLayout, EventData, TextField, Color } from "@nativescript/core";
// import { $WebView, $ActionBar, $StackLayout, $FlexboxLayout, $ContentView, $Image, $TextField, $GridLayout, $TextView } from "react-nativescript";
import { ToolbarButton } from "./ToolbarButton";
import { PrivacyIndicatorView } from "~/Views/PrivacyIndicatorView";
import { connect } from 'react-redux';
import { updateUrlBarText, submitUrlBarTextToWebView } from "~/store/navigationState";
import { WholeStoreState } from "~/store/store";
import { RetractionState } from "~/store/barsState";
import normalizeColorToObj, { ColorObj } from "~/utils/normalizeColorToObj";

interface Props {
    percentRevealed: number,
    retraction: RetractionState,
    slotBackgroundColor?: string,
    buttonBackgroundColor?: string,
    textFieldBackgroundColor?: string,
}

interface State {
}

const TabLocationViewUX = {
    Spacing: 8,
    PlaceholderLefPadding: 12,
    StatusIconSize: 18,
    TPIconSize: 24,
    ButtonSize: 44,
    URLBarPadding: 4,
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L83
class LockImageView extends React.Component<{ locked: boolean } & TouchableOpacityProps, {}> {
    render(){
        const { locked, ...rest } = this.props;

        return (
            // <$Image/>
            <ToolbarButton text={ locked ? "\uf023" : "\uf3c1" } {...rest}/>
        );
    }
}

interface DisplayTextFieldProps {
    style?: StyleProp<TextStyle>,

    activeTab: string,
    urlBarText: string,

    updateUrlBarText: typeof updateUrlBarText,
    // setUrlOnWebView: typeof setUrlOnWebView,
    submitUrlBarTextToWebView: typeof submitUrlBarTextToWebView,
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L319
class DisplayTextField extends React.Component<DisplayTextFieldProps & TextInputProps, {}> {
    private readonly onChangeText = (text: string) => {
        this.props.updateUrlBarText(text);
    };

    private readonly onSubmitEditing = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        this.props.submitUrlBarTextToWebView(e.nativeEvent.text, this.props.activeTab);
    };

    render(){
        const { urlBarText, style, ...rest } = this.props;

        return (
            <TextInput
                style={style}
                {...rest}
                value={urlBarText}
                autoCorrect={false}
                autoCapitalize={"none"}
                keyboardType={"url"}
                returnKeyType={"go"}
                onChangeText={this.onChangeText}
                placeholder={"Search or enter address"}
                onSubmitEditing={this.onSubmitEditing}
            />
        );
    }
}

const DisplayTextFieldConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // console.log(`wholeStoreState`, wholeStoreState);
        const { activeTab, tabs, urlBarText } = wholeStoreState.navigation;

        return {
            activeTab,
            // urlBarText: tabs[activeTab].url,
            urlBarText,
        };
    },
    {
        updateUrlBarText,
        submitUrlBarTextToWebView,
    },
)(DisplayTextField);

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L62
class UrlTextField extends React.Component<TextInputProps, {}> {
    render(){
        const { ...rest } = this.props;

        return (
            <DisplayTextFieldConnected {...rest}/>
            // <DisplayTextField urlBarText={"whatever"} {...rest}/>
        );
    }
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L111
class PageOptionsButton extends React.Component<{} & TouchableOpacityProps, {}> {
    render(){
        const { ...rest } = this.props;

        return (
            <ToolbarButton {...rest} text={"\uf141"}/>
        );
    }
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L105
class PrivacyIndicator extends React.Component<{} & TouchableOpacityProps, {}> {
    render(){
        const { ...rest } = this.props;

        return (
            <PrivacyIndicatorView {...rest}/>
        );
    }
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift
export class TabLocationView extends React.Component<Props & ViewProps, State>{

    render(){
        const { slotBackgroundColor = "purple", buttonBackgroundColor = "transparent", textFieldBackgroundColor = "white", retraction, percentRevealed, style, ...rest } = this.props;

        const factor: number = percentRevealed / 100;

        const revealedScale: number = 1;
        const retractedScale: number = 0;
        const scaleDiff: number = revealedScale - retractedScale;
        const animatedScale: number = (factor * scaleDiff) + retractedScale;
        // console.log(`animatedScale`, animatedScale);

        // const colorFromString = processColor('rgba(10, 20, 30, 0.4)');
        //                           aarrggbb
        // const expectedInt     = 0x660a141e;
        const slotBackgroundColorInt: number = processColor(slotBackgroundColor ? slotBackgroundColor : 0x00000000);

        const slotBackgroundColorObj: ColorObj = normalizeColorToObj(slotBackgroundColorInt);
        
        const revealedSlotBackgroundColorAlpha: number = 1;
        const retractedSlotBackgroundColorAlpha: number = 0;
        const slotBackgroundColorAlphaDiff: number = revealedSlotBackgroundColorAlpha - retractedSlotBackgroundColorAlpha;
        const animatedSlotBackgroundColorAlpha: number = (factor * 255 * slotBackgroundColorAlphaDiff) + retractedSlotBackgroundColorAlpha;
        const animatedSlotBackgroundColor: ColorObj = {
            a: animatedSlotBackgroundColorAlpha,
            r: slotBackgroundColorObj.r,
            g: slotBackgroundColorObj.g,
            b: slotBackgroundColorObj.b,
        };
        const animatedSlotBackgroundColorString: string = `rgba(${animatedSlotBackgroundColor.r},${animatedSlotBackgroundColor.g},${animatedSlotBackgroundColor.b},${animatedSlotBackgroundColor.a})`;
        // console.log(`animatedSlotBackgroundColor`, animatedSlotBackgroundColor);

        return (
            /* self.view */
            <View
                // iosOverflowSafeArea={false}
                style={StyleSheet.compose(
                    {
                        flexDirection: 'column'
                    },
                    style
                )}
                {...rest}
            >
                {/* self.contentView */}
                {/* https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L149 */}
                {/* https://developer.apple.com/documentation/uikit/uistackview */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        backgroundColor: animatedSlotBackgroundColorString,
                        borderRadius: 30,
                        margin: 8,
                        flexGrow: 1,
                    }}
                >
                    {/* frontSpaceView */}
                    <View style={{ width: TabLocationViewUX.Spacing }}/>

                    {/* privacyIndicator */}
                    <PrivacyIndicator
                        style={{
                            scaleX: animatedScale,
                            scaleY: animatedScale,
                        }}
                    />
                    
                    {/* privacyIndicatorSeparator */}
                    <View style={{ width: 3 }}/>
                    <LockImageView locked={true}/>
                    <UrlTextField
                        style={{
                            backgroundColor: textFieldBackgroundColor,
                            flexGrow: 1,
                        }}
                    />
                    <PageOptionsButton
                        style={{
                            backgroundColor: buttonBackgroundColor,
                            scaleX: animatedScale,
                            scaleY: animatedScale,
                        }}
                    />
                </View>
            </View>
        );
    }
}

export const TabLocationViewConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // console.log(`wholeStoreState`, wholeStoreState);
        return {
            retraction: wholeStoreState.bars.header.retraction,
            percentRevealed: wholeStoreState.bars.header.percentRevealed,
        };
    },
    {},
)(TabLocationView);