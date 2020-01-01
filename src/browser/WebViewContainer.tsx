import * as React from "react";
import { connect } from "react-redux";
import { WholeStoreState } from "~/store/store";
import { webViews, updateUrlBarText, TabStateRecord, setProgressOnWebView } from "~/store/navigationState";
import { setBarsRetraction, RetractionState } from "~/store/barsState";
import { View, Text, ViewProps, StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, ScrollView, SafeAreaView, Platform, findNodeHandle } from "react-native";
import { WebView } from 'react-native-webview';
import { IOSWebViewProps, WebViewNavigationEvent, WebViewProgressEvent } from 'react-native-webview/lib/WebViewTypes';
import Animated from "react-native-reanimated";
import { HEADER_RETRACTION_DISTANCE } from "./header/TabLocationView";

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L110
export class WebViewContainerBackdrop extends React.Component<ViewProps, {}> {
    render(){
        const { style, children, ...rest } = this.props;

        return (
            // UIView()
            <View
                style={StyleSheet.compose(
                    {
                        flexDirection: "column",
                        width: "100%",
                        height: "100%",
                    },
                    style
                )}
                // opacity={0.5}
                // backgroundColor={"purple"}
                {...rest}
            />
        );
    }
}

interface WebViewContainerProps {
    scrollY: Animated.Value<number>,
    scrollEndDragVelocity: Animated.Value<number>,
    snapOffset: Animated.Value<number>,
    animatedNavBarTranslateY: Animated.Node<number>,
    animatedTitleOpacity: Animated.Node<number>,

    barsState: WholeStoreState["bars"],
    activeTab: string,
    tabs: TabStateRecord,
    updateUrlBarText: typeof updateUrlBarText,
    setProgressOnWebView: typeof setProgressOnWebView,
    // setHeaderRetraction: typeof setHeaderRetraction,
    // setFooterRetraction: typeof setFooterRetraction,
    setBarsRetraction: typeof setBarsRetraction,
}

const IosWebView = WebView as React.ComponentClass<IOSWebViewProps>;
const AnimatedIosWebView = Animated.createAnimatedComponent(IosWebView) as React.ComponentClass<IOSWebViewProps>;

export class WebViewContainer extends React.Component<WebViewContainerProps & ViewProps, { }> {
    private readonly onLoadStarted = (event: WebViewNavigationEvent) => {
        const { url, navigationType } = event.nativeEvent;

        console.log(`[WebView onLoadStarted] url ${url} navigationType ${navigationType}`);
        
        // TODO: handle errors
    };

    private readonly onLoadCommitted = (event: WebViewNavigationEvent) => {
        const { url, navigationType } = event.nativeEvent;

        console.log(`[WebView onLoadCommitted] url ${url} navigationType ${navigationType}`);

        if(Platform.OS === "ios" || Platform.OS === "macos"){
            /* iOS seems to fire loading events on the non-main frame, so onLoadCommitted event is the best one on which to update the main-frame URL.
             * This event doesn't exist on Android to my knowledge, so I haven't hooked it up in BetterWebView. */
            this.props.updateUrlBarText(url);
        }
    };

    private readonly onLoadFinished = (event: WebViewNavigationEvent) => {
        const { url, navigationType } = event.nativeEvent;

        console.log(`[WebView onLoadFinished] url ${url} navigationType ${navigationType}`);

        // TODO: handle errors

        if(Platform.OS === "android"){
            /* TODO: check whether Android fires onLoadFinished at sensible moments for updating the URL bar text. */
            this.props.updateUrlBarText(url);
        }
    };

    private readonly onProgress = (event: WebViewProgressEvent) => {
        const { url, progress } = event.nativeEvent;
        console.log(`[WebView onLoadProgress] progress ${progress}`);

        this.props.setProgressOnWebView({ progress, tab: this.props.activeTab });
    };

    // const MyWebView = ({ children, ...rest }) => React.createElement(WebView, props, children);

    render(){
        const { activeTab, tabs, barsState, style, children, ...rest } = this.props;

        return (
            // UIView()
            <View
                style={StyleSheet.compose(
                    {
                        flexDirection: "column",
                        width: "100%",
                        height: "100%",
                    },
                    style
                )}
                {...rest}
            >
                <AnimatedIosWebView
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    source={{
                        uri: tabs[activeTab].url,
                    }}
                    // TODO: will have to solve how best to build one webView for each tab, give it a unique ref, and allow animation between tabs.
                    ref={webViews.get(activeTab)}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    panGestureTranslationInWebView: {
                                        // y: this.props.scrollY,
                                        y: (y) => {
                                            return Animated.block([
                                                Animated.cond(
                                                    /* We won't update scrollY if there was no panGesture movement.
                                                     * This is necessary because onScroll is called without gestures
                                                     * sometimes, e.g. due to autolayout when first initialising. */
                                                    Animated.neq(y, 0),
                                                       
                                                    /* We always receive a gesture relative to 0.
                                                    * e.g. when panning down (scrolling up): +3, 9, 12, 20.
                                                    * It needs to be added to the current this.props.scrollY to make sense. */
                                                    Animated.set(
                                                        this.props.scrollY,
                                                        Animated.max(
                                                            -HEADER_RETRACTION_DISTANCE,
                                                            Animated.min(
                                                                HEADER_RETRACTION_DISTANCE,
                                                                Animated.add(
                                                                    this.props.scrollY,
                                                                    y,
                                                                )
                                                            ),
                                                        ),
                                                    ),
                                                ),
                                                Animated.call(
                                                    [y],
                                                    (r) => {
                                                        console.log(`Reanimated got arg`, r[0]);
                                                    }
                                                )
                                            ]);
                                        }
                                    }
                                }
                            }
                        ],
                        {
                            useNativeDriver: true
                        }
                    )}
                    onScrollEndDrag={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    velocity: {
                                        y: this.props.scrollEndDragVelocity
                                    }
                                }
                            }
                        ],
                        {
                            useNativeDriver: true
                        }
                    )}
                    onLoadStart={this.onLoadStarted}
                    onLoadCommit={this.onLoadCommitted}
                    onLoadEnd={this.onLoadFinished}
                    onLoadProgress={this.onProgress}
                />
            </View>
        );
    }
}

export const WebViewContainerConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // console.log(`wholeStoreState`, wholeStoreState);
        return {
            barsState: wholeStoreState.bars,
            activeTab: wholeStoreState.navigation.activeTab,
            tabs: wholeStoreState.navigation.tabs,
        };
    },
    {
        updateUrlBarText,
        setProgressOnWebView,
        // setHeaderRetraction,
        // setFooterRetraction,
        setBarsRetraction,
    },
)(WebViewContainer);
