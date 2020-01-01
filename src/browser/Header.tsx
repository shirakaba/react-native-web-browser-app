import * as React from "react";
import { URLBarView } from "./URLBarView";
import { TopTabsViewController } from "./TopTabsViewController";
import { connect } from "react-redux";
import { WholeStoreState } from "~/store/store";
import { setBarsRetraction, RetractionState } from "~/store/barsState";
import { View, Text, ViewProps, StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, ScrollView, SafeAreaView, Platform, findNodeHandle } from "react-native";
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaConsumer, EdgeInsets } from 'react-native-safe-area-context';
import { GradientProgressBarConnected } from "~/Widgets/GradientProgressBar";
import Animated, { not } from "react-native-reanimated";
const { diffClamp, interpolate, event: reanimatedEvent, multiply, add, cond, lessThan, neq, Clock, Extrapolate, clockRunning, set, startClock, spring, sub, stopClock, eq } = Animated;


class TopTabsContainer extends React.Component<{}, {}>{

    render(){
        return (
            <View style={{ flexDirection: 'column' }}>
                <TopTabsViewController/>
            </View>
        );
    }
}

interface Props {
    scrollY: Animated.Value<number>,
    animatedTitleOpacity: Animated.Node<number>,
    animatedNavBarTranslateY: Animated.Node<number>,
    slotBackgroundColor?: string,
    textFieldBackgroundColor?: string,
    buttonBackgroundColor?: string,
    inOverlayMode: boolean,
    toolbarIsShowing: boolean,
}

interface State {

}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L105
// Header used to have a subchild, "UrlBarTopTabsContainer", but that has now been flattened.
export class Header extends React.Component<Props & ViewProps, State>{

    render(){
        const {
            slotBackgroundColor,
            textFieldBackgroundColor,
            buttonBackgroundColor,
            toolbarIsShowing,
            inOverlayMode,
            style,
            children,
            ...rest
        } = this.props;
        return (
            <View
                style={StyleSheet.compose(
                    {
                        flexDirection: 'column',
                        
                        justifyContent: "flex-start",
                        marginHorizontal: 4,
                        // flex: 1,
                        // backgroundColor: "orange",
                    },
                    style
                )}
                {...rest}
            >
                {/* urlBar */}
                <URLBarView
                    scrollY={this.props.scrollY}
                    animatedTitleOpacity={this.props.animatedTitleOpacity}
                    animatedNavBarTranslateY={this.props.animatedNavBarTranslateY}
                    inOverlayMode={inOverlayMode}
                    toolbarIsShowing={toolbarIsShowing}
                    slotBackgroundColor={slotBackgroundColor}
                    textFieldBackgroundColor={textFieldBackgroundColor}
                    buttonBackgroundColor={buttonBackgroundColor}
                />
                {/* topTabsContainer */}
                <TopTabsContainer/>
            </View>
        );
    }
}


interface RetractibleHeaderProps {
    scrollY: Animated.Value<number>,
    animatedTitleOpacity: Animated.Node<number>,
    animatedNavBarTranslateY: Animated.Node<number>,

    percentRevealed: number,
    urlBarText: string,
    orientation: "portrait"|"landscape"|"unknown",
    retraction: RetractionState,
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L61
// Formerly named "NotchAreaCover".
export class RetractibleHeader extends React.Component<RetractibleHeaderProps & Omit<ViewProps, "orientation">, {}> {
    render(){
        const { orientation, retraction, urlBarText, percentRevealed, style, children, ...rest } = this.props;

        /* Dimensions based on: https://github.com/taisukeh/ScrollingBars */
        // TODO: detect tablet vs. mobile on React Native.
        // const revealedHeight: number = orientation === "portrait" || Device.deviceType === "Tablet" ? 64 : 44;
        const revealedHeight: number = orientation === "portrait" ? 44 : 44;
        const retractedHeight: number = orientation === "portrait" ? 30 : 0;

        const heightDiff: number = revealedHeight - retractedHeight;
        const factor: number = percentRevealed / 100;
        const animatedHeight: number = (factor * heightDiff) + retractedHeight;

        // console.log(`[RetractibleHeader] animatedHeight: ${animatedHeight}; ${factor} * ${heightDiff} + ${retractedHeight}; retraction ${retraction}`);

        return (
            <SafeAreaConsumer>
                {(edgeInsets: EdgeInsets) => {
                    const unsafeAreaCoverHeight: number = edgeInsets.top;

                    return (
                        <Animated.View
                            style={{
                                flexDirection: "column",
                                // Best to be flex-end (stack children upon bottom edge) so that the loading bar hangs on the edge.
                                justifyContent: "flex-end",
                                // alignItems: "center",
                                width: "100%",
                                // height: animatedHeight + unsafeAreaCoverHeight,
                                backgroundColor: "gray",

                                paddingTop: edgeInsets.top,

                                // transform: [
                                //     {
                                //         translateY: this.props.animatedNavBarTranslateY as any,
                                //     },
                                // ]
                            }}
                            // height={{ value: animatedHeight, unit: "dip" }}
                            {...rest}
                        >
                            {/* TODO: make Header height shrink to new dynamic height */}
                            <Header
                                scrollY={this.props.scrollY}
                                animatedTitleOpacity={this.props.animatedTitleOpacity}
                                animatedNavBarTranslateY={this.props.animatedNavBarTranslateY}
                                toolbarIsShowing={orientation === "landscape"}
                                inOverlayMode={false}
                                slotBackgroundColor={"darkgray"}
                                textFieldBackgroundColor={"transparent"}
                                buttonBackgroundColor={"transparent"}
                                style={{
                                    paddingLeft: edgeInsets.left,
                                    paddingRight: edgeInsets.right,
                                }}
                            />
                            <GradientProgressBarConnected
                                style={{
                                    width: "100%",
                                }}
                            />
                        </Animated.View>
                    );
                }}
            </SafeAreaConsumer>
        );
    }
}


export const RetractibleHeaderConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // console.log(`wholeStoreState`, wholeStoreState);
        // console.log(`percentRevealed: ${wholeStoreState.bars.header.percentRevealed}`);
        return {
            urlBarText: wholeStoreState.navigation.urlBarText,
            retraction: wholeStoreState.bars.header.retraction,
            percentRevealed: wholeStoreState.bars.header.percentRevealed,
        };
    },
    {},
)(RetractibleHeader);
