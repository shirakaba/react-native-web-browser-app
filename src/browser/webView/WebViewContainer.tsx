import * as React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { HeaderConfig } from "../browserConfig";
import { BarAwareWebViewConnected } from "./BarAwareWebView";

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

interface WebViewContainerOwnProps {
    headerConfig: HeaderConfig,
    scrollY: Animated.Value<number>,
    scrollEndDragVelocity: Animated.Value<number>,
}

type WebViewContainerProps = WebViewContainerOwnProps & ViewProps;

export class WebViewContainer extends React.Component<WebViewContainerProps, { }> {
    render(){
        const { headerConfig, style, children, ...rest } = this.props;

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
                <BarAwareWebViewConnected
                    headerConfig={headerConfig}
                    scrollY={this.props.scrollY}
                    scrollEndDragVelocity={this.props.scrollEndDragVelocity}
                />
            </View>
        );
    }
}
