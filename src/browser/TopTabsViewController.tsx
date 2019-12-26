import * as React from "react";
import { WebView, ActionBar } from "@nativescript/core";
import { $WebView, $ActionBar, $StackLayout } from "react-nativescript";

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TopTabsViewController.swift
// Just a stub for now.
export class TopTabsViewController extends React.Component<{}, {}> {
    render(){
        return (
            // UIViewController().view
            <$StackLayout>
                {/* topTabFader */}
                {/* tabsButton */}
                {/* newTab */}
                {/* privateModeButton */}
            </$StackLayout>
        );
    }
}