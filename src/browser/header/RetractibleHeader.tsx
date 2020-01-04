import * as React from "react";
import { ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { EdgeInsets, SafeAreaConsumer } from 'react-native-safe-area-context';
import { connect } from "react-redux";
import { GRADIENT_PROGRESS_BAR_HEIGHT, defaultGradientProgressBar } from "../../browser/header/GradientProgressBar";
import { WholeStoreState } from "../../store/store";
import { HeaderConfig, RetractionStyle } from "../browserConfig";
import { defaultHeader } from "./Header";
import { DEFAULT_HEADER_RETRACTED_HEIGHT, DEFAULT_HEADER_REVEALED_HEIGHT } from "./TabLocationView";
import { URL_BAR_VIEW_PADDING_VERTICAL } from "./URLBarView";
const { interpolate, Extrapolate } = Animated;

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
                    const { config, orientation, scrollY, urlBarText, style, children, ...rest } = this.props;
                    const {
                        contentView = defaultHeader,
                        progressBar = defaultGradientProgressBar,
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
                            {contentView({
                                config,
                                scrollY,
                                animatedNavBarTranslateYLandscape: this.animatedNavBarTranslateYLandscape,
                                animatedNavBarTranslateYPortrait: this.animatedNavBarTranslateYPortrait,
                                animatedTitleOpacity: this.animatedTitleOpacity,
                                toolbarIsShowing: orientation === "landscape",
                                inOverlayMode: false,
                                style: {
                                    paddingLeft: edgeInsets.left,
                                    paddingRight: edgeInsets.right,
                                }
                            })}
                            {progressBar({
                                style: {
                                    width: "100%",
                                }
                            })}
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
