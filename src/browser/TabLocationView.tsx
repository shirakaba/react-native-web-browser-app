import * as React from "react";
import { TextInput, TextInputProps, NativeSyntheticEvent, TextInputSubmitEditingEventData, View, ViewProps, TouchableOpacityProps, StyleSheet, StyleProp, TextStyle, processColor } from "react-native";
// import { WebView, ActionBar, StackLayout, EventData, TextField, Color } from "@nativescript/core";
// import { $WebView, $ActionBar, $StackLayout, $FlexboxLayout, $ContentView, $Image, $TextField, $GridLayout, $TextView } from "react-nativescript";
import { ToolbarButton, ToolbarButtonProps } from "./ToolbarButton";
import { PrivacyIndicatorView } from "~/Views/PrivacyIndicatorView";
import { connect } from 'react-redux';
import { updateUrlBarText, submitUrlBarTextToWebView } from "~/store/navigationState";
import { WholeStoreState } from "~/store/store";
import { RetractionState } from "~/store/barsState";
import normalizeColorToObj, { ColorObj } from "~/utils/normalizeColorToObj";
import Animated, { Extrapolate } from "react-native-reanimated";

interface Props {
    scrollY: Animated.Value<number>,
    animatedTitleOpacity: Animated.Node<number>,
    animatedNavBarTranslateY: Animated.Node<number>,
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
class LockImageView extends React.Component<{ locked: boolean } & ToolbarButtonProps, {}> {
    render(){
        const { locked, ...rest } = this.props;

        return (
            // <$Image/>
            <ToolbarButton name={locked ? "lock" : "lock-open"} compact={true} {...rest}/>
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
                style={StyleSheet.compose(
                    {
                        /* Note: I suspect that Safari may use fontSize 16. */
                        fontSize: 18,
                        flex: 1,
                    },
                    style
                )}
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
class PageOptionsButton extends React.Component<{} & ToolbarButtonProps, {}> {
    render(){
        const { ...rest } = this.props;

        return (
            <ToolbarButton {...rest} name={"ellipsis-h"}/>
        );
    }
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L105
class PrivacyIndicator extends React.Component<{} & ToolbarButtonProps, {}> {
    render(){
        const { ...rest } = this.props;

        return (
            <PrivacyIndicatorView {...rest}/>
        );
    }
}

export const HEADER_RETRACTED_HEIGHT: number = 22;
export const HEADER_REVEALED_HEIGHT: number = 44;
export const HEADER_RETRACTION_DISTANCE: number = HEADER_REVEALED_HEIGHT - HEADER_RETRACTED_HEIGHT;

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift
export class TabLocationView extends React.Component<Props & Omit<ViewProps, "style">, State>{

    render(){
        const { slotBackgroundColor = "purple", buttonBackgroundColor = "transparent", textFieldBackgroundColor = "white", retraction, percentRevealed, ...rest } = this.props;

        const factor: number = percentRevealed / 100;

        const revealedScale: number = 1;
        const retractedScale: number = 0;
        const scaleDiff: number = revealedScale - retractedScale;
        const animatedScale: number = (factor * scaleDiff) + retractedScale;
        // console.log(`animatedScale`, animatedScale);

        // const colorFromString = processColor('rgba(10, 20, 30, 0.4)');
        //                           aarrggbb
        // const expectedInt     = 0x660a141e;
        const slotBackgroundColorObj: ColorObj = normalizeColorToObj(slotBackgroundColor);
        // console.log(`slotBackgroundColor ${slotBackgroundColor} -> slotBackgroundColorObj`, slotBackgroundColorObj);
        
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
            /* self.view now flattened down to simplify UI. */

            /* self.contentView */
            /* https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L149 */
            /* https://developer.apple.com/documentation/uikit/uistackview */
            <Animated.View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    // margin: 8,
                    flexGrow: 1,

                    /* Mirrors that of the round-cornered backdrop view. */
                    borderRadius: 10,

                    // transform: [
                    //     { scaleY: this.props.animatedTitleOpacity as any, },
                    // ],
                    // opacity: this.props.animatedTitleOpacity,
                    height: this.props.animatedNavBarTranslateY,

                    marginHorizontal: 8,
                    /* paddingVertical actually causes the text overflow to get clipped, so we'll instead get our padding
                     * by reserving more height than the content needs. */
                    // paddingVertical: 4,

                    // backgroundColor: "indigo",
                }}
            >
                {/* Simplest way to animate a backgroundColor fade-out with nativeDriver: introduce a backdrop view. */}
                <Animated.View
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                        backgroundColor: animatedSlotBackgroundColorString,
                        opacity: this.props.animatedTitleOpacity,
                    }}
                />

                {/* frontSpaceView */}
                <View style={{ width: TabLocationViewUX.Spacing }}/>

                {/* privacyIndicator */}
                <PrivacyIndicator
                    containerStyle={{
                        transform: [
                            { scaleX: this.props.animatedTitleOpacity as any },
                            { scaleY: this.props.animatedTitleOpacity as any },
                        ],
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
                    containerStyle={{
                        backgroundColor: buttonBackgroundColor,
                        transform: [
                            { scaleX: this.props.animatedTitleOpacity as any },
                            { scaleY: this.props.animatedTitleOpacity as any },
                        ],
                    }}
                />

                {/* Another spacer view */}
                <View style={{ width: TabLocationViewUX.Spacing }}/>
            </Animated.View>
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