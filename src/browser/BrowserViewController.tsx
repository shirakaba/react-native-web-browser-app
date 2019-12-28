import * as React from "react";
import { URLBarView } from "./URLBarView";
import { TopTabsViewController } from "./TopTabsViewController";
import { Header } from "./Header";
import { TabToolbar } from "./TabToolbar";
import { connect } from "react-redux";
import { WholeStoreState } from "~/store/store";
import { webViews, updateUrlBarText, TabStateRecord, setProgressOnWebView } from "~/store/navigationState";
import { setBarsRetraction, RetractionState } from "~/store/barsState";
import { View, Text, ViewProps, StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, ScrollView, SafeAreaView, Platform } from "react-native";
import { WebView } from 'react-native-webview';
import { IOSWebViewProps, WebViewNavigationEvent, WebViewProgressEvent } from 'react-native-webview/lib/WebViewTypes';
import { SafeAreaProvider, SafeAreaConsumer, EdgeInsets } from 'react-native-safe-area-context';

const BrowserViewControllerUX = {
    ShowHeaderTapAreaHeight: 0,
    BookmarkStarAnimationDuration: 0.5,
    BookmarkStarAnimationOffset: 80,
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L128
class TopTabsContainer extends React.Component<{}, {}> {
    render(){
        return (
            // UIView()
            <View style={{ flexDirection: "column" }}>
                {/* topTabsViewController.view */}
                <TopTabsViewController/>
            </View>
        );
    }
}

interface NotchAreaCoverProps {
    percentRevealed: number,
    urlBarText: string,
    orientation: "portrait"|"landscape"|"unknown",
    retraction: RetractionState,
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L61
class NotchAreaCover extends React.Component<NotchAreaCoverProps & Omit<ViewProps, "orientation">, {}> {
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

        // console.log(`[NotchAreaCover] animatedHeight: ${animatedHeight}; ${factor} * ${heightDiff} + ${retractedHeight}; retraction ${retraction}`);

        return (
            <SafeAreaConsumer>
                {(edgeInsets: EdgeInsets) => {
                    const unsafeAreaCoverHeight: number = edgeInsets.top;

                    return (
                        <View
                            style={StyleSheet.compose(
                                {
                                    flexDirection: "column",
                                    // Best to be flex-end (stack children upon bottom edge) so that the loading bar hangs on the edge.
                                    justifyContent: "flex-end",
                                    // alignItems: "center",
                                    width: "100%",
                                    height: animatedHeight + unsafeAreaCoverHeight,
                                    backgroundColor: "gray",
                                },
                                style
                            )}
                            // height={{ value: animatedHeight, unit: "dip" }}
                            {...rest}
                        >
                            <View
                                style={{
                                    height: unsafeAreaCoverHeight,
                                    backgroundColor: "gray",
                                }}
                            />
                            {/* TODO: ensure that the header sits within the safe area horizontally. */}
                            <Header
                                toolbarIsShowing={orientation === "landscape"}
                                inOverlayMode={false}
                                slotBackgroundColor={"darkgray"}
                                textFieldBackgroundColor={"transparent"}
                                buttonBackgroundColor={"transparent"}
                            />
                        </View>
                    );
                }}
            </SafeAreaConsumer>
        );
    }
}


const NotchAreaCoverConnected = connect(
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
)(NotchAreaCover);


// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L110
class WebViewContainerBackdrop extends React.Component<ViewProps, {}> {
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

class WebViewContainer extends React.Component<WebViewContainerProps & ViewProps, { }> {
    private readonly onBarRetractionRecommendation = (e) => {
        // console.log(`WebView onBarRetractionRecommendation ${Object.keys(e)}`);
        
        if(e.nativeEvent.recommendation === "retract"){
            // Gesture flings the scrollView upwards (scrolls downwards)
            this.props.setBarsRetraction({ bars: "both", animated: true, retraction: RetractionState.retracted });
        } else {
            this.props.setBarsRetraction({ bars: "both", animated: true, retraction: RetractionState.revealed });
        }
    };

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
                <IosWebView
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    source={{
                        uri: tabs[activeTab].url,
                    }}
                    // TODO: will have to solve how best to build one webView for each tab, give it a unique ref, and allow animation between tabs.
                    ref={webViews.get(activeTab)}
                    // onPan={this.onPan}
                    onRetractBarsRecommendation={this.onBarRetractionRecommendation}
                    onLoadStart={this.onLoadStarted}
                    onLoadCommit={this.onLoadCommitted}
                    onLoadEnd={this.onLoadFinished}
                    onLoadProgress={this.onProgress}
                    // Feeding in either bar's state is sufficient for now, unless we find a reason to start retracting them independently.
                    // barRetractionState={barsState.footer.retraction}
                />
            </View>
        );
    }
}

const WebViewContainerConnected = connect(
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

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L104
/**
 * TopTouchArea serves as an opaque status bar that can be tapped to scroll
 * back to the top of any scrollview that is made its subordinate in some way.
 */
class TopTouchArea extends React.Component<TouchableWithoutFeedbackProps, {}> {
    private readonly onPress = (e) => {
        console.log(`[TopTouchArea.onTap]`);
    };
    
    render(){
        const { children, ...rest } = this.props;

        // A Button would be more semantic, but is restricted to the Safe Area.

        return (
            <TouchableWithoutFeedback
                style={{
                    backgroundColor: "red",
                    // The trick here is that this background colour overflows beyond the safe area.
                    width: "100%",
                    height: 0,
                }}
                {...rest}
                onPress={this.onPress}
                // row={0}
            />
        );
    }
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L70
class AlertStackView extends React.Component<ViewProps, {}> {
    render(){
        const { style, children, ...rest } = this.props;

        return (
            <View
                style={StyleSheet.compose(
                    {
                        flexDirection: "column",
                    },
                    style
                )}
                {...rest}
            />
        );
    }
}

interface FooterProps {
    percentRevealed: number,
    orientation: "portrait"|"landscape"|"unknown",
    retraction: RetractionState,
    showToolbar: boolean,
};

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L103
class Footer extends React.Component<FooterProps & Omit<ViewProps, "orientation">, {}> {
    render(){
        const { retraction, showToolbar, orientation, percentRevealed, style, children, ...rest } = this.props;

        const revealedHeight: number = 44;
        const retractedHeight: number = 0;

        const heightDiff: number = revealedHeight - retractedHeight;
        const factor: number = percentRevealed / 100;
        const animatedHeight: number = (factor * heightDiff) + retractedHeight;

        if(showToolbar){
            /* Warning: I've tried other layouts (StackLayout and FlexboxLayout) here, but they shift
             * horizontally after rotation. Only ContentView seems to escape this bug. */
            return (
                <SafeAreaConsumer>
                    {(edgeInsets: EdgeInsets) => {
                        const unsafeAreaCoverHeight: number = edgeInsets.bottom;

                        return (
                            <View
                                style={StyleSheet.compose(
                                    {
                                        flexDirection: "column",
                                        height: animatedHeight + unsafeAreaCoverHeight,
                                        width: "100%",
                                        backgroundColor: "gray",
                                    },
                                    style
                                )}
                                // height={{ value: animatedHeight, unit: "dip" }}
                                {...rest}
                            >
                                <TabToolbar/>
                                <View
                                    style={{
                                        height: unsafeAreaCoverHeight,
                                        backgroundColor: "gray",
                                    }}
                                />
                            </View>
                        );
                    }}    
                </SafeAreaConsumer>
            );
        }

        // Unclear what footer should do when not showing toolbar...
        return (
            <View>
            </View>
        );
    }
}

const FooterConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // console.log(`wholeStoreState`, wholeStoreState);
        return {
            retraction: wholeStoreState.bars.footer.retraction,
            percentRevealed: wholeStoreState.bars.footer.percentRevealed,
        };
    },
    {},
)(Footer);

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L65
class OverlayBackground extends React.Component<ViewProps, {}> {
    render(){
        const { style, ...rest } = this.props;

        return (
            // UIVisualEffectView()
            <View
                style={StyleSheet.compose(
                    {
                        flexDirection: "column",
                    },
                    style
                )}
            />
        );
    }
}

interface Props {
    orientation: "portrait"|"landscape"|"unknown",
}

interface State {

}

export class BrowserViewController extends React.Component<Props, State> {

    render(){
        const { orientation } = this.props;
        // Visibility of certain components changes when switching app (if in private browsing mode)
        // https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L343

        return (
            <View
                // stretchLastChild={true}
                style={{
                    flex: 1,
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                }}
            >
                <NotchAreaCoverConnected orientation={orientation}/>

                <View
                    // dock={"bottom"}
                    // stretchLastChild={true}
                    style={{
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        flexGrow: 1,
                        alignItems:"center",
                        // justifyContent: "flex-start",
                        backgroundColor:"green",
                        flexDirection: "column",
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "column",
                            width: "100%",
                            // height: "100%",
                            // flexGrow: 1,
                        }}
                    >
                        <WebViewContainerBackdrop
                            style={{
                                backgroundColor: "gold",
                                position: "absolute",
                            }}
                        />
                        <WebViewContainerConnected
                            style={{
                                position: "absolute",
                                flexGrow: 1,
                            }}
                        />
                    </View>

                    <FooterConnected
                        style={{
                            backgroundColor: "gray",
                            display: orientation === "landscape" ? "none" : "flex",
                        }}
                    
                        orientation={orientation}
                        showToolbar={true}
                    />
                </View>
            </View>
        );
    }
}