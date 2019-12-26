import * as React from "react";
import { WebView, ActionBar } from "@nativescript/core";
import { $WebView, $ActionBar, $StackLayout } from "react-nativescript";
import { URLBarView } from "./URLBarView";
import { TopTabsViewController } from "./TopTabsViewController";
import { StackLayoutComponentProps } from "react-nativescript/dist/components/StackLayout";

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
            <$StackLayout>
                <TopTabsViewController/>
            </$StackLayout>
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
class UrlBarTopTabsContainer extends React.Component<UrlBarTopTabsContainerProps & StackLayoutComponentProps, {}> {
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
            // UIView(frame: CGRect.zero)
            <$StackLayout {...rest}>
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
            </$StackLayout>
        );
    }
}

export class Header extends React.Component<Props & StackLayoutComponentProps, State>{

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