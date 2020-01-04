import * as React from "react";
import { ToolbarButton } from "../../browser/bothBars/ToolbarButton";
import { TouchableOpacityProps } from "react-native";

interface Props {

}

interface State {
}

// https://github.com/cliqz/user-agent-ios/blob/7a91b5ea3e2fbb8b95dadd4f0cfd71b334e73449/UserAgent/Views/Privacy%20Indicator/PrivacyIndicatorView.swift
export class PrivacyIndicatorView extends React.Component<Props & TouchableOpacityProps, {}> {
    render(){
        const { ...rest } = this.props;
        return (
            <ToolbarButton name={"circle-notch"} {...rest}/>
            // <$StackLayout>
            //     {/* stub for canvasView, which is that donut graph. */}
            //     <$ContentView/>
            //     <$Button/>
            // </$StackLayout>
        );
    }
}