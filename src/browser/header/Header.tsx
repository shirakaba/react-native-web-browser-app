import * as React from "react";
import { URLBarView, URL_BAR_VIEW_PADDING_VERTICAL } from "./URLBarView";
import { TopTabsViewController } from "./TopTabsContainer";
import { connect } from "react-redux";
import { WholeStoreState } from "~/store/store";
import { View, ViewProps, StyleSheet, } from "react-native";
import { SafeAreaConsumer, EdgeInsets } from 'react-native-safe-area-context';
import { GradientProgressBarConnected, GRADIENT_PROGRESS_BAR_HEIGHT } from "~/browser/header/GradientProgressBar";
import Animated from "react-native-reanimated";
const { interpolate, Extrapolate } = Animated;
import { HeaderConfig, RetractionStyle } from "../browserConfig";
import { DEFAULT_HEADER_RETRACTED_HEIGHT, DEFAULT_HEADER_REVEALED_HEIGHT } from "./TabLocationView";

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
    config: HeaderConfig,
    animatedNavBarTranslateYPortrait: Animated.Node<number>,
    animatedNavBarTranslateYLandscape: Animated.Node<number>,
    animatedTitleOpacity: Animated.Node<number>,

    scrollY: Animated.Value<number>,
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
            config,
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
                    config={config}
                    scrollY={this.props.scrollY}
                    animatedTitleOpacity={this.props.animatedTitleOpacity}
                    animatedNavBarTranslateYLandscape={this.props.animatedNavBarTranslateYLandscape}
                    animatedNavBarTranslateYPortait={this.props.animatedNavBarTranslateYPortrait}
                    inOverlayMode={inOverlayMode}
                    toolbarIsShowing={toolbarIsShowing}
                />
                {/* topTabsContainer */}
                <TopTabsContainer/>
            </View>
        );
    }
}


interface RetractibleHeaderProps {
    config: HeaderConfig,
    scrollY: Animated.Value<number>,

    urlBarText: string,
    orientation: "portrait"|"landscape",
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L61
// Formerly named "NotchAreaCover".
export class RetractibleHeader extends React.Component<RetractibleHeaderProps & Omit<ViewProps, "orientation">, {}> {
    private readonly animatedNavBarTranslateYPortrait: Animated.Node<number>;
    private readonly animatedNavBarTranslateYLandscape: Animated.Node<number>;
    private readonly animatedTitleOpacity: Animated.Node<number>;

    constructor(props: RetractibleHeaderProps & Omit<ViewProps, "orientation">){
        super(props);

        const { config } = props;
        const {
            buttons,
            landscapeRetraction,
            portraitRetraction,
            HEADER_RETRACTED_HEIGHT = DEFAULT_HEADER_RETRACTED_HEIGHT,
            HEADER_REVEALED_HEIGHT = DEFAULT_HEADER_REVEALED_HEIGHT,
        } = config;

        const HEADER_HIDDEN_HEIGHT: number = 0;
        const HEADER_RETRACTION_DISTANCE: number = HEADER_REVEALED_HEIGHT - HEADER_RETRACTED_HEIGHT;

        // const diffClampNode = diffClamp(
        //     add(this.scrollY, this.snapOffset),
        //     0,
        //     NAV_BAR_HEIGHT,
        // );
        // const inverseDiffClampNode = multiply(diffClampNode, -1);

        // const clock = new Clock();

        // const snapPoint = cond(
        //     lessThan(diffClampNode, NAV_BAR_HEIGHT / 2),
        //     0,
        //     -NAV_BAR_HEIGHT,
        // );

        // this.animatedNavBarTranslateY = cond(
        //     // Condition to detect if we stopped scrolling
        //     neq(this.scrollEndDragVelocity, DRAG_END_INITIAL),
        //     runSpring({
        //         clock,
        //         from: inverseDiffClampNode,
        //         velocity: 0,
        //         toValue: snapPoint,
        //         scrollEndDragVelocity: this.scrollEndDragVelocity,
        //         snapOffset: this.snapOffset,
        //         diffClampNode,
        //     }),
        //     inverseDiffClampNode,
        // );

        this.animatedNavBarTranslateYPortrait = interpolate(this.props.scrollY, {
            // -y means finger is moving upwards (so bar should retract)
            inputRange: [-HEADER_RETRACTION_DISTANCE, HEADER_RETRACTION_DISTANCE],
            outputRange: [HEADER_RETRACTED_HEIGHT, HEADER_REVEALED_HEIGHT],

            /* To disable header retraction */
            // outputRange: [HEADER_REVEALED_HEIGHT, HEADER_REVEALED_HEIGHT],
            
            extrapolate: Extrapolate.CLAMP,
        });

        this.animatedNavBarTranslateYLandscape = interpolate(this.props.scrollY, {
            // -y means finger is moving upwards (so bar should retract)
            inputRange: [-HEADER_RETRACTION_DISTANCE, HEADER_RETRACTION_DISTANCE],
            outputRange: [HEADER_HIDDEN_HEIGHT, HEADER_REVEALED_HEIGHT],

            /* To disable header retraction */
            // outputRange: [HEADER_REVEALED_HEIGHT, HEADER_REVEALED_HEIGHT],
            
            extrapolate: Extrapolate.CLAMP,
        });

        this.animatedTitleOpacity = interpolate(this.props.scrollY, {
            inputRange: [-(HEADER_RETRACTION_DISTANCE), (HEADER_RETRACTION_DISTANCE)],
            outputRange: [0, 1],
            extrapolate: Extrapolate.CLAMP,
        });
    }

    render(){
        return (
            <SafeAreaConsumer>
                {(edgeInsets: EdgeInsets) => {
                    const { config, orientation, urlBarText, style, children, ...rest } = this.props;
                    const {
                        buttons,
                        backgroundColor,
                        landscapeRetraction,
                        portraitRetraction,
                        HEADER_RETRACTED_HEIGHT = DEFAULT_HEADER_RETRACTED_HEIGHT,
                        HEADER_REVEALED_HEIGHT = DEFAULT_HEADER_REVEALED_HEIGHT,
                    } = config;
                    const HEADER_HIDDEN_HEIGHT: number = 0;
                    const retractionStyle: RetractionStyle = orientation === "portrait" ? portraitRetraction : landscapeRetraction;

                    const unsafeAreaCoverHeight: number = edgeInsets.top;

                    let heightStyle;
                    switch(retractionStyle){
                        case RetractionStyle.alwaysRevealed:
                        case RetractionStyle.retractToCompact:
                        case RetractionStyle.alwaysCompact:
                            heightStyle = {
                                height: "auto"
                            };
                            break;
                        case RetractionStyle.retractToHidden:
                            heightStyle = {
                                height: Animated.interpolate(
                                    this.animatedNavBarTranslateYLandscape,
                                    {
                                        inputRange: [HEADER_HIDDEN_HEIGHT, HEADER_REVEALED_HEIGHT],
                                        outputRange: [HEADER_HIDDEN_HEIGHT, HEADER_REVEALED_HEIGHT + URL_BAR_VIEW_PADDING_VERTICAL * 2 + edgeInsets.top + GRADIENT_PROGRESS_BAR_HEIGHT],
                                        extrapolate: Extrapolate.CLAMP,
                                    }
                                ),
                            };
                            break;
                        case RetractionStyle.alwaysHidden:
                            heightStyle = {
                                height: HEADER_HIDDEN_HEIGHT
                            };
                    }

                    return (
                        <Animated.View
                            style={[
                                {
                                    flexDirection: "column",
                                    // Best to be flex-end (stack children upon bottom edge) so that the loading bar hangs on the edge.
                                    justifyContent: "flex-end",
                                    // alignItems: "center",
                                    width: "100%",
                                    backgroundColor,

                                    paddingTop: edgeInsets.top,
                                },
                                heightStyle
                            ]}
                            {...rest}
                        >
                            <Header
                                config={config}
                                scrollY={this.props.scrollY}
                                animatedNavBarTranslateYLandscape={this.animatedNavBarTranslateYLandscape}
                                animatedNavBarTranslateYPortrait={this.animatedNavBarTranslateYPortrait}
                                animatedTitleOpacity={this.animatedTitleOpacity}
                                toolbarIsShowing={orientation === "landscape"}
                                inOverlayMode={false}
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
        return {
            urlBarText: wholeStoreState.navigation.urlBarText,
            orientation: wholeStoreState.ui.orientation,
        };
    },
    {},
)(RetractibleHeader);
