import * as React from "react";
import { Button, TouchableOpacityProps } from "react-native";
import { ToolbarButton } from "./ToolbarButton";
import { goBackOnWebView, goForwardOnWebView, reloadWebView, stopWebView } from "~/store/navigationState";
import { connect } from "react-redux";
import { WholeStoreState } from "~/store/store";

// From URLBarView

interface BackButtonProps {
    goBackOnWebView: typeof goBackOnWebView,
}
class BackButton extends React.Component<BackButtonProps & TouchableOpacityProps, {}> {
    private readonly onTap = () => {
        this.props.goBackOnWebView();
    };

    render(){
        const { ...rest } = this.props;
        return (
            <ToolbarButton
                {...rest}
                onTap={this.onTap}
                text={"\uf053"}
            />
        );
    }
}
export const BackButtonConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // May support pop-out history in future.
        return {};
    },
    {
        goBackOnWebView,
    },
)(BackButton);

interface ForwardButtonProps {
    goForwardOnWebView: typeof goForwardOnWebView,
}
class ForwardButton extends React.Component<ForwardButtonProps & TouchableOpacityProps, {}> {
    private readonly onTap = () => {
        this.props.goForwardOnWebView();
    };

    render(){
        const { ...rest } = this.props;
        return (
            <ToolbarButton
                {...rest}
                onTap={this.onTap}
                text={"\uf054"}
            />
        );
    }
}
export const ForwardButtonConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // May support pop-out history in future.
        return {};
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

class StopReloadButton extends React.Component<StopReloadButtonProps & TouchableOpacityProps, {}> {
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
                text={
                    loading ?
                    // Stop (cross symbol)
                    "\uf00d" :
                    // Reload (redo symbol)
                    "\uf01e"
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
class MenuButton extends React.Component<{} & TouchableOpacityProps, {}> {
    render(){
        const { ...rest } = this.props;
        return (
            <ToolbarButton {...rest} text={"\uf142"}/>
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
class SearchButton extends React.Component<{} & TouchableOpacityProps, {}> {
    render(){
        const { ...rest } = this.props;
        return (
            <ToolbarButton text={"\uf002"}/>
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
class TabsButton extends React.Component<{} & TouchableOpacityProps, {}>{

    render(){
        const { ...rest } = this.props;

        return (
            <ToolbarButton {...rest} text={"\uf009"}/>
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
            <Button {...rest}/>
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