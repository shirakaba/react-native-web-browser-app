import * as React from "react";
import { Text, TouchableOpacityProps, TouchableOpacity } from "react-native";
import { ToolbarButton, ToolbarButtonProps } from "./ToolbarButton";
import { goBackOnWebView, goForwardOnWebView, reloadWebView, stopWebView } from "../../store/navigationState";
import { connect } from "react-redux";
import { WholeStoreState } from "../../store/store";

// From URLBarView

interface BackButtonProps {
    canGoBack: boolean,
    goBackOnWebView: typeof goBackOnWebView,
}
class BackButton extends React.Component<BackButtonProps & ToolbarButtonProps, {}> {
    private readonly onTap = () => {
        this.props.goBackOnWebView();
    };

    render(){
        const { canGoBack, ...rest } = this.props;
        return (
            <ToolbarButton
                {...rest}
                enabled={canGoBack}
                onTap={this.onTap}
                name={"chevron-left"}
            />
        );
    }
}
export const BackButtonConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // May support pop-out history in future.
        return {
            canGoBack: wholeStoreState.navigation.tabs[wholeStoreState.navigation.activeTab].canGoBack,
        };
    },
    {
        goBackOnWebView,
    },
)(BackButton);

interface ForwardButtonProps {
    canGoForward: boolean,
    goForwardOnWebView: typeof goForwardOnWebView,
}
class ForwardButton extends React.Component<ForwardButtonProps & ToolbarButtonProps, {}> {
    private readonly onTap = () => {
        this.props.goForwardOnWebView();
    };

    render(){
        const { canGoForward, ...rest } = this.props;
        return (
            <ToolbarButton
                {...rest}
                enabled={canGoForward}
                onTap={this.onTap}
                name={"chevron-right"}
            />
        );
    }
}
export const ForwardButtonConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // May support pop-out history in future.
        return {
            canGoForward: wholeStoreState.navigation.tabs[wholeStoreState.navigation.activeTab].canGoForward,
        };
    },
    {
        goForwardOnWebView,
    },
)(ForwardButton);

interface StopReloadButtonProps {
    loading: boolean,

    stopWebView: typeof stopWebView,
    reloadWebView: typeof reloadWebView,
}

class StopReloadButton extends React.Component<StopReloadButtonProps & ToolbarButtonProps, {}> {
    private readonly onTap = () => {
        if(this.props.loading){
            this.props.stopWebView();
        } else {
            this.props.reloadWebView();
        }
    };

    render(){
        const { loading, ...rest } = this.props;

        return (
            <ToolbarButton
                {...rest}
                onTap={this.onTap}
                name={
                    loading ?
                    // Stop (cross symbol)
                    "times" :
                    // Reload (redo symbol)
                    "redo"
                }
            />
        );
    }
}
export const StopReloadButtonConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        const { activeTab, tabs } = wholeStoreState.navigation;
        // console.log(`[StopReloadButtonConnected] wholeStoreState.navigation`, wholeStoreState.navigation);
        return {
            loading: tabs[activeTab].loadProgress !== 1,
        };
    },
    {
        reloadWebView,
        stopWebView,
    },
)(StopReloadButton);

// From TabToolbar
/**
 * Menu refers to the app menu, not a page-specific menu.
 */
class MenuButton extends React.Component<{} & ToolbarButtonProps, {}> {
    render(){
        const { ...rest } = this.props;
        return (
            <ToolbarButton {...rest} name={"ellipsis-v"}/>
        );
    }
}
export const MenuButtonConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        return {};
    },
    {
        // TODO
    },
)(MenuButton);
class SearchButton extends React.Component<{} & ToolbarButtonProps, {}> {
    render(){
        const { ...rest } = this.props;
        return (
            <ToolbarButton name={"search"}/>
        );
    }
}
export const SearchButtonConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        return {};
    },
    {
        // TODO
    },
)(SearchButton);
// https://github.com/cliqz/user-agent-ios/blob/7a91b5ea3e2fbb8b95dadd4f0cfd71b334e73449/Client/Frontend/Browser/TabToolbar.swift#L146
class TabsButton extends React.Component<{} & ToolbarButtonProps, {}>{

    render(){
        const { ...rest } = this.props;

        return (
            <ToolbarButton {...rest} name={"th-large"}/>
        );
    }
}
export const TabsButtonConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        return {};
    },
    {
        // TODO
    },
)(TabsButton);

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/URLBarView.swift#L136
class CancelButton extends React.Component<{} & TouchableOpacityProps, {}>{
    render(){
        const { ...rest } = this.props;
        return (
            <TouchableOpacity {...rest}>
                <Text>Cancel</Text>
            </TouchableOpacity>
        );
    }
}
export const CancelButtonConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        return {};
    },
    {
        // TODO
    },
)(CancelButton);