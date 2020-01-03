import * as React from "react";
import { GradientProgressBarConnected } from "./GradientProgressBar";
import { AutocompleteTextField } from "~/browser/header/AutocompleteTextField";
import { TabLocationView, TabLocationViewConnected } from "./TabLocationView";
import { BackButtonConnected, ForwardButtonConnected, StopReloadButtonConnected, TabsButtonConnected, MenuButtonConnected, CancelButtonConnected } from "../bothBars/BarButtons";
import { connect } from "react-redux";
import { WholeStoreState } from "~/store/store";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { HeaderConfig } from "../browserConfig";

/* https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/URLBarView.swift */

interface Props {
    config: HeaderConfig,
    scrollY: Animated.Value<number>,
    animatedTitleOpacity: Animated.Node<number>,
    animatedNavBarTranslateYPortait: Animated.Node<number>,
    animatedNavBarTranslateYLandscape: Animated.Node<number>,
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
            <View>

            </View>
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

export const URL_BAR_VIEW_PADDING_VERTICAL: number = 8;

export class URLBarView extends React.Component<Props, State>{
    constructor(props: Props){
        super(props);
        
        this.state = {
            location: "https://www.birchlabs.co.uk",
        };
    }

    render(){
        const { config, slotBackgroundColor = "gray", textFieldBackgroundColor = "white", buttonBackgroundColor = "transparent", toolbarIsShowing, inOverlayMode } = this.props;
        const { } = this.state;

        let stackContents: React.ReactNode;

        if(inOverlayMode){
            // i.e. URL bar's text field has been focused and the browser displays an overlay over the webpage.
            stackContents = (
                <>
                    {/* AKA locationTextField */}
                    <ToolbarTextField/>
                    <CancelButtonConnected style={{ backgroundColor: buttonBackgroundColor }}/>
                </>
            );
        } else if(toolbarIsShowing){
            // i.e. landscape (so show all the items that the footer would normally handle)
            stackContents = (
                <>
                    <BackButtonConnected containerStyle={{ backgroundColor: buttonBackgroundColor }}/>
                    <ForwardButtonConnected containerStyle={{ backgroundColor: buttonBackgroundColor }}/>
                    <StopReloadButtonConnected containerStyle={{ backgroundColor: buttonBackgroundColor }}/>
                    {/* AKA locationView. */}
                    <TabLocationViewConnected
                        config={config}
                        scrollY={this.props.scrollY}
                        animatedTitleOpacity={this.props.animatedTitleOpacity}
                        animatedNavBarTranslateYLandscape={this.props.animatedNavBarTranslateYLandscape}
                        animatedNavBarTranslateYPortrait={this.props.animatedNavBarTranslateYPortait}
                        slotBackgroundColor={slotBackgroundColor}
                        buttonBackgroundColor={buttonBackgroundColor}
                        textFieldBackgroundColor={textFieldBackgroundColor}
                    />
                    <TabsButtonConnected containerStyle={{ backgroundColor: buttonBackgroundColor }}/>
                    <MenuButtonConnected containerStyle={{ backgroundColor: buttonBackgroundColor }}/>
                </>
            );
        } else {
            // i.e. portrait (so hide all the items that the footer will be handling)
            stackContents = (
                <>
                    {/* AKA locationView. */}
                    <TabLocationViewConnected
                        config={config}
                        scrollY={this.props.scrollY}
                        animatedTitleOpacity={this.props.animatedTitleOpacity}
                        animatedNavBarTranslateYLandscape={this.props.animatedNavBarTranslateYLandscape}
                        animatedNavBarTranslateYPortrait={this.props.animatedNavBarTranslateYPortait}
                        slotBackgroundColor={slotBackgroundColor}
                        buttonBackgroundColor={buttonBackgroundColor}
                        textFieldBackgroundColor={textFieldBackgroundColor}
                    />
                </>
            );
        }

        return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    height: "auto",
                    width: "100%",
                    paddingVertical: URL_BAR_VIEW_PADDING_VERTICAL,

                    // backgroundColor: "green",
                }}
            >
                {stackContents}
            </View>
        );
    }
}