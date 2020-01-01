import * as React from "react";
import { URLBarView } from "./URLBarView";
import { TopTabsViewController } from "./TopTabsContainer";
import { connect } from "react-redux";
import { WholeStoreState } from "~/store/store";
import { setBarsRetraction, RetractionState } from "~/store/barsState";
import { View, ViewProps, StyleSheet, } from "react-native";
import { SafeAreaConsumer, EdgeInsets } from 'react-native-safe-area-context';
import { GradientProgressBarConnected } from "~/browser/header/GradientProgressBar";
import Animated, { not } from "react-native-reanimated";
import { HEADER_RETRACTION_DISTANCE, HEADER_RETRACTED_HEIGHT, HEADER_REVEALED_HEIGHT } from "./TabLocationView";
import { runSpring, DRAG_END_INITIAL, NAV_BAR_HEIGHT } from "../bothBars/barSpring";
const { interpolate, Extrapolate } = Animated;

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
    scrollEndDragVelocity: Animated.Value<number>,
    scrollY: Animated.Value<number>,
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
    private readonly animatedNavBarTranslateY: Animated.Node<number>;
    private readonly animatedTitleOpacity: Animated.Node<number>;
    private readonly snapOffset: Animated.Value<number> = new Animated.Value(0);

    constructor(props: Props & ViewProps){
        super(props);

        const diffClampNode = Animated.diffClamp(
            Animated.add(this.props.scrollY, this.snapOffset),
            // 0,
            // NAV_BAR_HEIGHT,
            // HEADER_RETRACTED_HEIGHT,
            // HEADER_REVEALED_HEIGHT,

            0,
            HEADER_RETRACTION_DISTANCE,
        );
        const inverseDiffClampNode = Animated.multiply(diffClampNode, -1);

        const clock = new Animated.Clock();

        const snapPoint = Animated.cond(
            Animated.lessThan(diffClampNode, HEADER_RETRACTION_DISTANCE / 2),
            // 0,
            // -NAV_BAR_HEIGHT,
            HEADER_RETRACTED_HEIGHT,
            // -HEADER_RETRACTION_DISTANCE,
            HEADER_REVEALED_HEIGHT,
        );

        this.animatedNavBarTranslateY = Animated.cond(
            // Condition to detect if we stopped scrolling
            Animated.neq(this.props.scrollEndDragVelocity, DRAG_END_INITIAL),
            runSpring({
                clock,
                from: inverseDiffClampNode,
                velocity: 0,
                toValue: snapPoint,
                scrollEndDragVelocity: this.props.scrollEndDragVelocity,
                snapOffset: this.snapOffset,
                diffClampNode,
            }),
            inverseDiffClampNode,
        );

        // this.animatedNavBarTranslateY = interpolate(this.props.scrollY, {
        //     // -y means finger is moving upwards (so bar should retract)
        //     inputRange: [-(HEADER_RETRACTION_DISTANCE), (HEADER_RETRACTION_DISTANCE)],
        //     outputRange: [HEADER_RETRACTED_HEIGHT, HEADER_REVEALED_HEIGHT],

        //     /* To disable header retraction */
        //     // outputRange: [HEADER_REVEALED_HEIGHT, HEADER_REVEALED_HEIGHT],
            
        //     extrapolate: Extrapolate.CLAMP,
        // });

        this.animatedTitleOpacity = interpolate(this.props.scrollY, {
            inputRange: [-(HEADER_RETRACTION_DISTANCE), (HEADER_RETRACTION_DISTANCE)],
            outputRange: [0, 1],
            extrapolate: Extrapolate.CLAMP,
        });
    }

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
                    animatedTitleOpacity={this.animatedTitleOpacity}
                    animatedNavBarTranslateY={this.animatedNavBarTranslateY}
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
    scrollEndDragVelocity: Animated.Value<number>,
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
                                scrollEndDragVelocity={this.props.scrollEndDragVelocity}
                                scrollY={this.props.scrollY}
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
