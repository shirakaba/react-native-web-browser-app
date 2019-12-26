import * as React from "react";
import { WebView, ActionBar, StackLayout } from "@nativescript/core";
import { $WebView, $ActionBar, $StackLayout, $FlexboxLayout, $ContentView, $Image, $TextField, $Button } from "react-nativescript";
import { ToolbarButton } from "~/browser/ToolbarButton";
import { ButtonComponentProps } from "react-nativescript/dist/components/Button";

interface Props {

}

interface State {
}

// https://github.com/cliqz/user-agent-ios/blob/7a91b5ea3e2fbb8b95dadd4f0cfd71b334e73449/UserAgent/Views/Privacy%20Indicator/PrivacyIndicatorView.swift
export class PrivacyIndicatorView extends React.Component<Props & ButtonComponentProps, {}> {
    render(){
        const { ...rest } = this.props;
        return (
            <ToolbarButton text={"\uf1ce"} {...rest}/>
            // <$StackLayout>
            //     {/* stub for canvasView, which is that donut graph. */}
            //     <$ContentView/>
            //     <$Button/>
            // </$StackLayout>
        );
    }
}