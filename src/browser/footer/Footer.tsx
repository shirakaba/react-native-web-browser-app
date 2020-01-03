import * as React from "react";
import { TabToolbar } from "./TabToolbar";
import { connect } from "react-redux";
import { WholeStoreState } from "~/store/store";
import { View, Text, ViewProps, StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, ScrollView, SafeAreaView, Platform, findNodeHandle } from "react-native";
import { SafeAreaProvider, SafeAreaConsumer, EdgeInsets } from 'react-native-safe-area-context';
import Animated, { not } from "react-native-reanimated";
import { HEADER_RETRACTION_DISTANCE } from "../header/TabLocationView";
import { RetractionStyle, FooterConfig } from "~/browser/browserConfig";
const { diffClamp, interpolate, event: reanimatedEvent, multiply, add, cond, lessThan, neq, Clock, Extrapolate, clockRunning, set, startClock, spring, sub, stopClock, eq } = Animated;


interface FooterOwnProps {
    // retractionStyle: RetractionStyle.retractToHidden|RetractionStyle.alwaysRevealed,
    config: FooterConfig,
    scrollY: Animated.Value<number>,
    orientation: "portrait"|"landscape",
    showToolbar: boolean,
};

type FooterProps = FooterOwnProps & Omit<ViewProps, "orientation"|"style">;

export const FOOTER_RETRACTED_HEIGHT: number = 0;
export const FOOTER_REVEALED_HEIGHT: number = 44;

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L103
export class Footer extends React.Component<FooterProps, {}> {
    render(){
        const { config, showToolbar, orientation, children, ...rest } = this.props;
        const { buttons, landscapeRetraction, portraitRetraction } = config;

        const retractionStyle = orientation === "portrait" ? portraitRetraction : landscapeRetraction;

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
                                        /* Combine this with auto height. */
                                        // paddingBottom: unsafeAreaCoverHeight,
                                        paddingLeft: edgeInsets.left,
                                        paddingRight: edgeInsets.right,
                                        
                                        height: retractionStyle === RetractionStyle.alwaysRevealed ? 
                                            FOOTER_REVEALED_HEIGHT + unsafeAreaCoverHeight : 
                                            interpolate(this.props.scrollY, {
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
            orientation: wholeStoreState.ui.orientation,
        };
    },
    {},
)(Footer);