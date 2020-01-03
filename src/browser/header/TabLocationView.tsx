import * as React from "react";
import { TextInput, TextInputProps, NativeSyntheticEvent, TextInputSubmitEditingEventData, View, ViewProps, StyleSheet, StyleProp, TextStyle } from "react-native";
import { ToolbarButton, ToolbarButtonProps } from "../bothBars/ToolbarButton";
import { PrivacyIndicatorView } from "~/browser/header/PrivacyIndicatorView";
import { connect } from 'react-redux';
import { updateUrlBarText, submitUrlBarTextToWebView } from "~/store/navigationState";
import { WholeStoreState } from "~/store/store";
import Animated from "react-native-reanimated";
import { HeaderConfig, RetractionStyle } from "../browserConfig";

interface Props {
    config: HeaderConfig,
    orientation: "portrait"|"landscape",
    scrollY: Animated.Value<number>,
    animatedTitleOpacity: Animated.Node<number>,
    animatedNavBarTranslateYPortrait: Animated.Node<number>,
    animatedNavBarTranslateYLandscape: Animated.Node<number>,
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
        const { config, slotBackgroundColor = "purple", buttonBackgroundColor = "transparent", textFieldBackgroundColor = "white", orientation, ...rest } = this.props;
        const { buttons, landscapeRetraction, portraitRetraction } = config;
        const retractionStyle: RetractionStyle = orientation === "portrait" ? portraitRetraction : landscapeRetraction;

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
                    height: 0
                };
        }

        // Where 1 is not compact and 0 is fully compact.
        let compactionFactor;
        switch(retractionStyle){
            case RetractionStyle.alwaysRevealed:
                compactionFactor = 1;
                break;
            case RetractionStyle.alwaysHidden:
            case RetractionStyle.alwaysCompact:
                compactionFactor = 0;
                break;
            case RetractionStyle.retractToCompact:
            case RetractionStyle.retractToHidden:
                compactionFactor = this.props.animatedTitleOpacity as any;
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
                        opacity: compactionFactor,
                    }}
                />

                {/* frontSpaceView */}
                <View style={{ width: TabLocationViewUX.Spacing }}/>

                {/* privacyIndicator */}
                <PrivacyIndicator
                    containerStyle={{
                        transform: [
                            { scaleX: compactionFactor },
                            { scaleY: compactionFactor },
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
                            { scaleX: compactionFactor },
                            { scaleY: compactionFactor },
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
            orientation: wholeStoreState.ui.orientation,
        };
    },
    {},
)(TabLocationView);