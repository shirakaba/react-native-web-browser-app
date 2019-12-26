import * as React from "react";
import { WebView, ActionBar, StackLayout } from "@nativescript/core";
import { $WebView, $ActionBar, $StackLayout, $Button, $FlexboxLayout } from "react-nativescript";
import { GradientProgressBarConnected } from "../Widgets/GradientProgressBar";
import { ToolbarButton } from "./ToolbarButton";
import { AutocompleteTextField } from "~/Widgets/AutocompleteTextField";
import { TabLocationView, TabLocationViewConnected } from "./TabLocationView";
import { ButtonComponentProps } from "react-nativescript/dist/components/Button";
import { BackButtonConnected, ForwardButtonConnected, StopReloadButtonConnected, TabsButtonConnected, MenuButtonConnected, CancelButtonConnected } from "./BarButtons";
import { connect } from "react-redux";
import { WholeStoreState } from "~/store/store";

/* https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/URLBarView.swift */

interface Props {
    slotBackgroundColor?: string,
    textFieldBackgroundColor?: string,
    buttonBackgroundColor?: string,
    inOverlayMode: boolean,
    toolbarIsShowing: boolean,
    // location: string, // locationTextField?.text
}

interface State {
    // text: string, // locationTextField?.text
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/URLBarView.swift#L786
class ToolbarTextField extends React.Component<{}, {}>{
    // Just a themeable AutocompleteTextField
    render(){
        return (
            <AutocompleteTextField/>
        );
    }
}

// We need a subclass so we can setup the shadows correctly
// This subclass creates a strong shadow on the URLBar
class TabLocationContainerView extends React.Component<{}, {}>{
    render(){
        return (
            <$StackLayout>

            </$StackLayout>
        );
    }
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/URLBarView.swift#L108
class LocationContainer extends React.Component<{}, {}>{
    render(){
        return (
            <TabLocationContainerView/>
        );
    }
}

export class URLBarView extends React.Component<Props, State>{
    constructor(props: Props){
        super(props);
        
        this.state = {
            location: "https://www.birchlabs.co.uk",
        };
    }

    render(){
        const { slotBackgroundColor = "gray", textFieldBackgroundColor = "white", buttonBackgroundColor = "transparent", toolbarIsShowing, inOverlayMode } = this.props;
        const { } = this.state;

        let stackContents: React.ReactNode;

        if(inOverlayMode){
            // i.e. URL bar's text field has been focused and the browser displays an overlay over the webpage.
            stackContents = (
                <$FlexboxLayout
                    flexDirection={"row"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                    height={"auto"}
                    width={{ value: 100, unit: "%" }}
                >
                    {/* AKA locationTextField */}
                    <ToolbarTextField/>
                    <CancelButtonConnected backgroundColor={buttonBackgroundColor}/>
                </$FlexboxLayout>
            );
        } else if(toolbarIsShowing){
            // i.e. landscape (so show all the items that the footer would normally handle)
            stackContents = (
                <$FlexboxLayout
                    flexDirection={"row"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                    height={"auto"}
                    width={{ value: 100, unit: "%" }}
                    // flexWrap={"nowrap"}
                >
                    <BackButtonConnected backgroundColor={buttonBackgroundColor}/>
                    <ForwardButtonConnected backgroundColor={buttonBackgroundColor}/>
                    <StopReloadButtonConnected backgroundColor={buttonBackgroundColor}/>
                    {/* AKA locationView. */}
                    <TabLocationViewConnected slotBackgroundColor={slotBackgroundColor} buttonBackgroundColor={buttonBackgroundColor} textFieldBackgroundColor={textFieldBackgroundColor} flexGrow={1}/>
                    <TabsButtonConnected backgroundColor={buttonBackgroundColor}/>
                    <MenuButtonConnected backgroundColor={buttonBackgroundColor}/>
                </$FlexboxLayout>
            );
        } else {
            // i.e. portrait (so hide all the items that the footer will be handling)
            stackContents = (
                <$FlexboxLayout
                    flexDirection={"row"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                    height={"auto"}
                    width={{ value: 100, unit: "%" }}
                >
                    {/* AKA locationView. */}
                    <TabLocationViewConnected slotBackgroundColor={slotBackgroundColor} buttonBackgroundColor={buttonBackgroundColor} textFieldBackgroundColor={textFieldBackgroundColor} flexGrow={1}/>
                </$FlexboxLayout>
            );
        }

        return (
            <$StackLayout orientation={"vertical"}>
                {stackContents}
                <GradientProgressBarConnected
                    width={{ value: 100, unit: "%" }}
                />
            </$StackLayout>
        );
    }
}