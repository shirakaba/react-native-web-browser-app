import * as React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { HeaderConfig } from "../browserConfig";
import { TopTabsViewController } from "./TopTabsContainer";
import { URLBarView } from "./URLBarView";

class TopTabsContainer extends React.Component<{}, {}>{

    render(){
        return (
            <View style={{ flexDirection: 'column' }}>
                <TopTabsViewController/>
            </View>
        );
    }
}

interface HeaderOwnProps {
    config: HeaderConfig,
    animatedNavBarTranslateYPortrait: Animated.Node<number>,
    animatedNavBarTranslateYLandscape: Animated.Node<number>,
    animatedTitleOpacity: Animated.Node<number>,

    scrollY: Animated.Value<number>,
    inOverlayMode: boolean,
    toolbarIsShowing: boolean,
}

export type HeaderProps = HeaderOwnProps & ViewProps;
export type HeaderType = (props: HeaderProps) => React.ReactNode;
export const defaultHeader = (props: HeaderProps) => <Header {...props}/>;

interface State {

}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L105
// Header used to have a subchild, "UrlBarTopTabsContainer", but that has now been flattened.
export class Header extends React.Component<HeaderProps, State>{
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
