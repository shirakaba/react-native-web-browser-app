import * as React from "react";
import { View } from "react-native";

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TopTabsViewController.swift
// Just a stub for now.
export class TopTabsViewController extends React.Component<{}, {}> {
    render(){
        return (
            // UIViewController().view
            <View>
                {/* topTabFader */}
                {/* tabsButton */}
                {/* newTab */}
                {/* privateModeButton */}
            </View>
        );
    }
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L128
export class TopTabsContainer extends React.Component<{}, {}> {
    render(){
        return (
            // UIView()
            <View style={{ flexDirection: "column" }}>
                {/* topTabsViewController.view */}
                <TopTabsViewController/>
            </View>
        );
    }
}