import * as React from "react";
import { TextInput, TextInputProps, NativeSyntheticEvent, TextInputSubmitEditingEventData, View, ViewProps, StyleSheet, StyleProp, TextStyle } from "react-native";
import { ToolbarButton, ToolbarButtonProps } from "../bothBars/ToolbarButton";
import { PrivacyIndicatorView } from "../../browser/header/PrivacyIndicatorView";
import { connect } from 'react-redux';
import { updateUrlBarText, submitUrlBarTextToWebView } from "../../store/navigationState";
import { WholeStoreState } from "../../store/store";
import Animated, { Transitioning } from "react-native-reanimated";
import { HeaderConfig } from "../browserConfig";
import { RetractionStyle } from "../bothBars/BarConfig";

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
            <ToolbarButton name={locked ? "lock" : "lock-open"} {...rest}/>
        );
    }
}

class ClearUrlBarTextButton extends React.Component<{ urlBarText: string, updateUrlBarText: typeof updateUrlBarText, } & ToolbarButtonProps, {}> {
    private readonly onClearButtonPress = () => {
        this.props.updateUrlBarText({ text: "", fromNavigationEvent: false });
    };

    render(){
        const { urlBarText, light, brand, ...rest } = this.props;

        return (
            <ToolbarButton 
                onPress={this.onClearButtonPress}
                name={"times-circle"}
                solid
                {...rest}
            />
        );
    }
}

const ClearUrlBarTextButtonConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // console.log(`wholeStoreState`, wholeStoreState);
        const { urlBarText } = wholeStoreState.navigation;

        return {
            urlBarText,
        };
    },
    {
        updateUrlBarText,
    },
)(ClearUrlBarTextButton);

interface DisplayTextFieldProps {
    style?: StyleProp<TextStyle>,

    activeTab: string,
    urlBarText: string,
    updateUrlBarText: typeof updateUrlBarText,
    submitUrlBarTextToWebView: typeof submitUrlBarTextToWebView,
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L319
class DisplayTextField extends React.Component<DisplayTextFieldProps & TextInputProps, {}> {
    private readonly onChangeText = (text: string) => {
        this.props.updateUrlBarText({ text, fromNavigationEvent: false });
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
        const { activeTab, urlBarText } = wholeStoreState.navigation;

        return {
            activeTab,
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

export const DEFAULT_HEADER_RETRACTED_HEIGHT: number = 22;
export const DEFAULT_HEADER_REVEALED_HEIGHT: number = 44;
// export const HEADER_RETRACTION_DISTANCE: number = DEFAULT_HEADER_REVEALED_HEIGHT - DEFAULT_HEADER_RETRACTED_HEIGHT;


interface Props {
    activeTabIsSecure: boolean|null,
    urlBarText: string,
    updateUrlBarText: typeof updateUrlBarText,
    config: HeaderConfig,
    orientation: "portrait"|"landscape",
    scrollY: Animated.Value<number>,
    animatedTitleOpacity: Animated.Node<number>,
    animatedNavBarTranslateYPortrait: Animated.Node<number>,
    animatedNavBarTranslateYLandscape: Animated.Node<number>,
}

interface State {
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift
export class TabLocationView extends React.Component<Props & Omit<ViewProps, "style">, State>{
    render(){
        const { activeTabIsSecure, urlBarText, config, orientation, ...rest } = this.props;
        const { slotBackgroundColor = "darkgray", textFieldTextColor = "black", textFieldBackgroundColor = "transparent", landscapeRetraction, portraitRetraction, HEADER_RETRACTED_HEIGHT = DEFAULT_HEADER_RETRACTED_HEIGHT, HEADER_REVEALED_HEIGHT = DEFAULT_HEADER_REVEALED_HEIGHT, buttonEnabledColor, buttonDisabledColor } = config;
        const retractionStyle: RetractionStyle = orientation === "portrait" ? portraitRetraction : landscapeRetraction;

        const HEADER_HIDDEN_HEIGHT: number = 0;
        const HEADER_RETRACTION_DISTANCE: number = HEADER_REVEALED_HEIGHT - HEADER_RETRACTED_HEIGHT;

        let heightStyle;
        switch(retractionStyle){
            case RetractionStyle.alwaysRevealed:
                heightStyle = {
                    // height: "auto",
                    height: HEADER_REVEALED_HEIGHT,
                };
                break;
            case RetractionStyle.alwaysCompact:
                heightStyle = {
                    height: HEADER_RETRACTED_HEIGHT,
                };
                break;
            case RetractionStyle.retractToCompact:
            case RetractionStyle.retractToHidden:
                heightStyle = {
                    height: this.props.animatedNavBarTranslateYPortrait,
                };
                break;
            case RetractionStyle.alwaysHidden:
                heightStyle = {
                    height: HEADER_HIDDEN_HEIGHT
                };
        }

        // Where 1 is not compact and 0 is fully compact.
        let scaleFactor: number;
        switch(retractionStyle){
            case RetractionStyle.alwaysRevealed:
                scaleFactor = 1;
                break;
            case RetractionStyle.alwaysHidden:
            case RetractionStyle.alwaysCompact:
                scaleFactor = 0;
                break;
            case RetractionStyle.retractToCompact:
            case RetractionStyle.retractToHidden:
                scaleFactor = this.props.animatedTitleOpacity as any;
                break;
        }

        return (
            /* self.view now flattened down to simplify UI. */

            /* self.contentView */
            /* https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L149 */
            /* https://developer.apple.com/documentation/uikit/uistackview */
            <Animated.View
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        // margin: 8,
                        flexGrow: 1,

                        /* Mirrors that of the round-cornered backdrop view. */
                        borderRadius: 10,

                        marginHorizontal: 8,
                        /* paddingVertical actually causes the text overflow to get clipped, so we'll instead get our padding
                        * by reserving more height than the content needs. */
                        // paddingVertical: 4,

                        // backgroundColor: "indigo",
                    },
                    heightStyle
                ]}
            >
                {/* Simplest way to animate a backgroundColor fade-out with nativeDriver: introduce a backdrop view. */}
                <Animated.View
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                        backgroundColor: slotBackgroundColor,
                        opacity: scaleFactor,
                    }}
                />

                {/* frontSpaceView */}
                <View style={{ width: TabLocationViewUX.Spacing }}/>

                {/* privacyIndicator */}
                <PrivacyIndicator
                    enabledColor={buttonEnabledColor}
                    disabledColor={buttonDisabledColor}
                    containerStyle={{
                        transform: [
                            { scaleX: scaleFactor },
                            { scaleY: scaleFactor },
                        ],
                    }}
                />
                
                {/* privacyIndicatorSeparator */}
                <View style={{ width: 3 }}/>
                <LockImageView
                    enabledColor={buttonEnabledColor}
                    disabledColor={buttonDisabledColor}
                    locked={!!activeTabIsSecure}
                    containerStyle={{
                        /* I'm not sure how ftp:// and sftp:// links are usually represented, so we'll hide the lock altogether. */
                        display: activeTabIsSecure === null ? "none": "flex",
                        /* Nothing to do with animation; just my lazy way of making it more compact. */
                        transform: [
                            { scaleX: 0.66 },
                            { scaleY: 0.66 },
                        ]
                    }}
                />
                <UrlTextField
                    style={{
                        color: textFieldTextColor,
                        backgroundColor: textFieldBackgroundColor,
                        flexGrow: 1,
                    }}
                />
                <ClearUrlBarTextButtonConnected
                    containerStyle={{
                        /* TODO: hide this button altogether in compact mode. */
                        display: urlBarText.length > 0 ? "flex": "none",
                        /* Nothing to do with animation; just my lazy way of making it more compact. */
                        transform: [
                            { scaleX: 0.80 },
                            { scaleY: 0.80 },
                        ]
                    }}
                />
                <PageOptionsButton
                    enabledColor={buttonEnabledColor}
                    disabledColor={buttonDisabledColor}
                    containerStyle={{
                        transform: [
                            { scaleX: scaleFactor },
                            { scaleY: scaleFactor },
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
        // console.log(`wholeStoreState.navigation.urlBarText`, wholeStoreState.navigation.urlBarText);
        return {
            orientation: wholeStoreState.ui.orientation,
            urlBarText: wholeStoreState.navigation.urlBarText,
            activeTabIsSecure: wholeStoreState.navigation.tabs[wholeStoreState.navigation.activeTab].isSecure,
        };
    },
    {
        updateUrlBarText,
    },
)(TabLocationView);