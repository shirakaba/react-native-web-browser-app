import * as React from "react";
import { WebView, ActionBar, PanGestureEventData, isIOS, isAndroid, Device } from "@nativescript/core";
import { $WebView, $ActionBar, $StackLayout, $Button, $AbsoluteLayout, $ContentView, $GridLayout, $DockLayout, $FlexboxLayout, $Label } from "react-nativescript";
import { StackLayoutProps, ButtonProps } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { URLBarView } from "./URLBarView";
import { TopTabsViewController } from "./TopTabsViewController";
import { Header } from "./Header";
import { TabToolbar } from "./TabToolbar";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { StackLayoutComponentProps } from "react-nativescript/dist/components/StackLayout";
import { ButtonComponentProps } from "react-nativescript/dist/components/Button";
import { LoadEventData } from "tns-core-modules/ui/web-view/web-view";
import { connect } from "react-redux";
import { WholeStoreState } from "~/store/store";
import { webViews, updateUrlBarText, TabStateRecord, setProgressOnWebView } from "~/store/navigationState";
import { BetterWebView } from "~/components/BetterWebView";
import { ProgressEventData } from "~/NativeScriptCoreUIForks/WebView/web-view";
import { setBarsRetraction } from "~/store/barsState";
import { BarRetractionRecommendationEventData } from "~/nativeElements/BarAwareWebView/bar-aware-web-view";
import { RetractionState } from "~/nativeElements/BarAwareWebView/bar-aware-web-view-interfaces";

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
            <$StackLayout>
                {/* topTabsViewController.view */}
                <TopTabsViewController/>
            </$StackLayout>
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
class NotchAreaCover extends React.Component<NotchAreaCoverProps & Omit<StackLayoutComponentProps, "orientation">, {}> {
    render(){
        const { orientation, retraction, urlBarText, percentRevealed, children, ...rest } = this.props;

        /* Dimensions based on: https://github.com/taisukeh/ScrollingBars */
        const revealedHeight: number = orientation === "portrait" || Device.deviceType === "Tablet" ? 64 : 44;
        const retractedHeight: number = orientation === "portrait" ? 30 : 0;

        const heightDiff: number = revealedHeight - retractedHeight;
        const factor: number = percentRevealed / 100;
        const animatedHeight: number = (factor * heightDiff) + retractedHeight;

        // console.log(`[NotchAreaCover] animatedHeight: ${animatedHeight}; ${factor} * ${heightDiff} + ${retractedHeight}; retraction ${retraction}`);

        return (
            <$FlexboxLayout
                flexDirection={"column"}
                // Best to be flex-end (stack children upon bottom edge) so that the loading bar hangs on the edge.
                justifyContent={"flex-end"}
                alignItems={"center"}
                height={{ value: animatedHeight, unit: "dip" }}
                width={{ value: 100, unit: "%"}}
                backgroundColor={"gray"}
                {...rest}
            >
                <Header
                    toolbarIsShowing={orientation === "landscape"}
                    inOverlayMode={false}
                    slotBackgroundColor={"darkgray"}
                    textFieldBackgroundColor={"transparent"}
                    buttonBackgroundColor={"transparent"}
                />
            </$FlexboxLayout>
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
class WebViewContainerBackdrop extends React.Component<StackLayoutComponentProps, {}> {
    render(){
        const { children, ...rest } = this.props;

        return (
            // UIView()
            <$StackLayout
                // opacity={0.5}
                // backgroundColor={"purple"}
                width={{ value: 100, unit: "%" }}
                height={{ value: 100, unit: "%" }}
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

class WebViewContainer extends React.Component<WebViewContainerProps & StackLayoutComponentProps, { }> {
    // private readonly onPan = (e: PanGestureEventData) => {
    //     console.log(`WebView panned type ${e.type} - deltaX ${e.deltaX} deltaY ${e.deltaY}`);
    //     if(e.deltaY < 0){
    //         // Gesture flings the scrollView upwards (scrolls downwards)
    //         this.props.setBarsRetraction({ bars: "both", animated: true, retraction: RetractionState.retracted });
    //     } else {
    //         this.props.setBarsRetraction({ bars: "both", animated: true, retraction: RetractionState.revealed });
    //     }
    // };

    private readonly onBarRetractionRecommendation = (e: BarRetractionRecommendationEventData) => {
        // console.log(`WebView barsShouldRetract ${e.barsShouldRetract}`);
        
        if(e.barsShouldRetract){
            // Gesture flings the scrollView upwards (scrolls downwards)
            this.props.setBarsRetraction({ bars: "both", animated: true, retraction: RetractionState.retracted });
        } else {
            this.props.setBarsRetraction({ bars: "both", animated: true, retraction: RetractionState.revealed });
        }
    };

    private readonly onLoadStarted = (args: LoadEventData) => {
        const { error, eventName, url, navigationType, object } = args;
        const wv: WebView = object as WebView;
        console.log(`[WebView onLoadStarted] error ${error}, eventName ${eventName}, url ${url} (vs. src ${wv.src}), navigationType ${navigationType}`);
        
        // TODO: handle errors
    };

    private readonly onLoadCommitted = (args: LoadEventData) => {
        const { error, eventName, url, navigationType, object } = args;
        const wv: WebView = object as WebView;
        console.log(`[WebView onLoadCommitted] error ${error}, eventName ${eventName}, url ${url} (vs. src ${wv.src}), navigationType ${navigationType}`);

        // TODO: handle errors

        if(!error && isIOS){
            /* iOS seems to fire loading events on the non-main frame, so onLoadCommitted event is the best one on which to update the main-frame URL.
             * This event doesn't exist on Android to my knowledge, so I haven't hooked it up in BetterWebView. */
            this.props.updateUrlBarText(url);
        }
    };

    private readonly onLoadFinished = (args: LoadEventData) => {
        const { error, eventName, url, navigationType, object } = args;
        const wv: WebView = object as WebView;
        console.log(`[WebView onLoadFinished] error ${error}, eventName ${eventName}, url ${url} (vs. src ${wv.src}), navigationType ${navigationType}`);

        // TODO: handle errors

        if(!error && isAndroid){
            /* TODO: check whether Android fires onLoadFinished at sensible moments for updating the URL bar text. */
            this.props.updateUrlBarText(url);
        }
    };

    private readonly onProgress = (args: ProgressEventData) => {
        const { eventName, progress, object } = args;
        const wv: WebView = object as WebView;
        console.log(`[WebView onLoadFinished] eventName ${eventName}, progress ${progress}`);

        this.props.setProgressOnWebView({ progress, tab: this.props.activeTab });
    };

    render(){
        const { activeTab, tabs, barsState, children, ...rest } = this.props;

        return (
            // UIView()
            <$StackLayout
                width={{ value: 100, unit: "%" }}
                height={{ value: 100, unit: "%" }}
                {...rest}
            >
                <BetterWebView
                    // TODO: will have to solve how best to build one webView for each tab, give it a unique ref, and allow animation between tabs.
                    ref={webViews.get(activeTab)}
                    // onPan={this.onPan}
                    onBarRetractionRecommendation={this.onBarRetractionRecommendation}
                    onLoadStarted={this.onLoadStarted}
                    onLoadCommitted={this.onLoadCommitted}
                    onLoadFinished={this.onLoadFinished}
                    onProgress={this.onProgress}
                    // Feeding in either bar's state is sufficient for now, unless we find a reason to start retracting them independently.
                    barRetractionState={barsState.footer.retraction}
                    width={{ value: 100, unit: "%" }}
                    height={{ value: 100, unit: "%" }}
                    src={tabs[activeTab].url}
                />
            </$StackLayout>
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
class TopTouchArea extends React.Component<ButtonComponentProps, {}> {
    private readonly onTap = (e) => {
        console.log(`[TopTouchArea.onTap]`);
    };
    
    render(){
        const { children, ...rest } = this.props;

        // A Button would be more semantic, but is restricted to the Safe Area.

        return (
            <$ContentView
                {...rest}
                onTap={this.onTap}
                row={0}
                // The trick here is that this background colour overflows beyond the safe area.
                backgroundColor={"red"}
                className=""
                width={{ value: 100, unit: "%"}}
                height={{ value: 0, unit: "dip" }}
            />
        );
    }
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L70
class AlertStackView extends React.Component<StackLayoutComponentProps, {}> {
    render(){
        const { children, ...rest } = this.props;

        return (
            <$StackLayout {...rest}/>
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
class Footer extends React.Component<FooterProps & Omit<StackLayoutComponentProps, "orientation">, {}> {
    render(){
        const { retraction, showToolbar, orientation, percentRevealed, children, ...rest } = this.props;

        const revealedHeight: number = 44;
        const retractedHeight: number = 0;

        const heightDiff: number = revealedHeight - retractedHeight;
        const factor: number = percentRevealed / 100;
        const animatedHeight: number = (factor * heightDiff) + retractedHeight;

        if(showToolbar){
            /* Warning: I've tried other layouts (StackLayout and FlexboxLayout) here, but they shift
             * horizontally after rotation. Only ContentView seems to escape this bug. */
            return (
                <$ContentView
                    height={{ value: animatedHeight, unit: "dip" }}
                    width={{ value: 100, unit: "%" }}
                    {...rest}
                >
                    <TabToolbar/>
                </$ContentView>
            );
        }

        // Unclear what footer should do when not showing toolbar...
        return (
            <$ContentView>
            </$ContentView>
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
class OverlayBackground extends React.Component<{}, {}> {
    render(){
        const {} = this.props;

        return (
            // UIVisualEffectView()
            <$StackLayout/>
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
            <$DockLayout
                stretchLastChild={true}
                width={{ value: 100, unit: "%"}}
                height={{ value: 100, unit: "%"}}
            >
                <NotchAreaCoverConnected dock={"top"} orientation={orientation}/>

                <$DockLayout
                    dock={"bottom"}
                    stretchLastChild={true}
                    width={{ value: 100, unit: "%"}}
                    height={{ value: 100, unit: "%"}}
                >
                    <FooterConnected dock={"bottom"} orientation={orientation} showToolbar={true} backgroundColor={"gray"} visibility={orientation === "landscape" ? "collapse" : "visible"}/>
                    <$GridLayout
                        dock={"top"}
                        width={{ value: 100, unit: "%"}}
                        height={{ value: 100, unit: "%" }}
                        rows={[new ItemSpec(1, "star")]}
                        columns={[new ItemSpec(1, "star")]}
                    >
                        <WebViewContainerBackdrop row={0} col={0} backgroundColor={"gold"}/>
                        <WebViewContainerConnected row={0} col={0}/>
                    </$GridLayout>
                </$DockLayout>
            </$DockLayout>
        );
    }
}