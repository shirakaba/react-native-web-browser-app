import * as React from "react";
import { TabToolbar } from "./TabToolbar";
import { connect } from "react-redux";
import { WholeStoreState } from "~/store/store";
import { setBarsRetraction, RetractionState } from "~/store/barsState";
import { View, Text, ViewProps, StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, ScrollView, SafeAreaView, Platform, findNodeHandle } from "react-native";
import { SafeAreaProvider, SafeAreaConsumer, EdgeInsets } from 'react-native-safe-area-context';
import Animated, { not } from "react-native-reanimated";
import { HEADER_RETRACTION_DISTANCE } from "./TabLocationView";
const { diffClamp, interpolate, event: reanimatedEvent, multiply, add, cond, lessThan, neq, Clock, Extrapolate, clockRunning, set, startClock, spring, sub, stopClock, eq } = Animated;


interface FooterOwnProps {
    scrollY: Animated.Value<number>,
    percentRevealed: number,
    orientation: "portrait"|"landscape"|"unknown",
    retraction: RetractionState,
    showToolbar: boolean,
};

type FooterProps = FooterOwnProps & Omit<ViewProps, "orientation"|"style">;

export const FOOTER_RETRACTED_HEIGHT: number = 0;
export const FOOTER_REVEALED_HEIGHT: number = 44;

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L103
export class Footer extends React.Component<FooterProps, {}> {
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
                <SafeAreaConsumer>
                    {(edgeInsets: EdgeInsets) => {
                        const unsafeAreaCoverHeight: number = edgeInsets.bottom;

                        return (
                            <Animated.View
                                style={{
                                        flexDirection: "column",
                                        width: "100%",
                                        backgroundColor: "gray",
                                        display: orientation === "landscape" ? "none" : "flex",
                                        /* Combine this with auto height. */
                                        // paddingBottom: unsafeAreaCoverHeight,
                                        paddingLeft: edgeInsets.left,
                                        paddingRight: edgeInsets.right,
                                        
                                        // height: FOOTER_REVEALED_HEIGHT + unsafeAreaCoverHeight,
                                        height: interpolate(this.props.scrollY, {
                                            // We'll keep the footer retraction in sync with that of the header retraction.
                                            // -y means finger is moving upwards (so bar should retract)
                                            inputRange: [-(HEADER_RETRACTION_DISTANCE), (HEADER_RETRACTION_DISTANCE)],
                                            outputRange: [FOOTER_RETRACTED_HEIGHT, add(FOOTER_REVEALED_HEIGHT, unsafeAreaCoverHeight)],
                                            extrapolate: Extrapolate.CLAMP,
                                        }),
                                    }
                                }
                                // height={{ value: animatedHeight, unit: "dip" }}
                                {...rest}
                            >
                                <TabToolbar/>
                            </Animated.View>
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

export const FooterConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // console.log(`wholeStoreState`, wholeStoreState);
        return {
            retraction: wholeStoreState.bars.footer.retraction,
            percentRevealed: wholeStoreState.bars.footer.percentRevealed,
        };
    },
    {},
)(Footer);