import * as React from "react";
import { URLBarView } from "./URLBarView";
import { TopTabsViewController } from "./TopTabsViewController";
import { ViewProps, View, StyleSheet } from "react-native";

interface Props {
    slotBackgroundColor?: string,
    textFieldBackgroundColor?: string,
    buttonBackgroundColor?: string,
    inOverlayMode: boolean,
    toolbarIsShowing: boolean,
}

interface State {

}

class TopTabsContainer extends React.Component<{}, {}>{

    render(){
        return (
            <View style={{ flexDirection: 'column' }}>
                <TopTabsViewController/>
            </View>
        );
    }
}

interface UrlBarTopTabsContainerProps {
    slotBackgroundColor?: string,
    textFieldBackgroundColor?: string,
    buttonBackgroundColor?: string,
    inOverlayMode: boolean,
    toolbarIsShowing: boolean,
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L105
class UrlBarTopTabsContainer extends React.Component<UrlBarTopTabsContainerProps & ViewProps, {}> {
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
            // UIView(frame: CGRect.zero)
            
            <View
                style={StyleSheet.compose(
                    {
                        flexDirection: 'column'
                    },
                    style
                )}
                {...rest}
            >
                {/* urlBar */}
                <URLBarView
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

export class Header extends React.Component<Props & ViewProps, State>{

    render(){
        const {
            slotBackgroundColor,
            textFieldBackgroundColor,
            buttonBackgroundColor,
            toolbarIsShowing,
            inOverlayMode,
            children,
            ...rest
        } = this.props;
        return (
            <UrlBarTopTabsContainer
                inOverlayMode={inOverlayMode}
                toolbarIsShowing={toolbarIsShowing}
                slotBackgroundColor={slotBackgroundColor}
                textFieldBackgroundColor={textFieldBackgroundColor}
                buttonBackgroundColor={buttonBackgroundColor}
                {...rest}
            />
        );
    }
}