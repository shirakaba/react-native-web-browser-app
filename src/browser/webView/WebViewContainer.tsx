import * as React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { HeaderConfig } from "../browserConfig";
import { BarAwareWebViewConnected, BarAwareWebViewOwnProps, BarAwareWebViewType } from "./BarAwareWebView";

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
    barAwareWebView?: BarAwareWebViewType,
    headerConfig: HeaderConfig,
    scrollY: Animated.Value<number>,
    scrollEndDragVelocity: Animated.Value<number>,
}

type WebViewContainerProps = WebViewContainerOwnProps & ViewProps;
export const DefaultBarAwareWebView: BarAwareWebViewType = (props: BarAwareWebViewOwnProps) => <BarAwareWebViewConnected {...props}/>;

export class WebViewContainer extends React.Component<WebViewContainerProps, { }> {
    render(){
        const { barAwareWebView = DefaultBarAwareWebView, headerConfig, scrollY, scrollEndDragVelocity, style, children, ...rest } = this.props;

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
                {barAwareWebView({
                    headerConfig,
                    scrollY,
                    scrollEndDragVelocity,
                })}
            </View>
        );
    }
}
