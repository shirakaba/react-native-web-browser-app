import * as React from "react";
import { View, ViewProps, StyleProp, ViewStyle } from "react-native";
import { BackButtonConnected, ForwardButtonConnected, MenuButtonConnected, SearchButtonConnected, TabsButtonConnected, } from "../bothBars/BarButtons";
import { HeaderConfig } from "../browserConfig";

interface Props {
    config: HeaderConfig,
    style?: ViewStyle,
}

interface State {

}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabToolbar.swift#L199
export class TabToolbar extends React.Component<Props & ViewProps, State>{

    render(){
        const { config, style, ...rest } = this.props;

        return (
            <View
                style={[
                    {
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: "100%",
                        paddingTop: 16,
                    },
                    style
                ]}
                {...rest}
            >
                {/* actionButtons */}
                <BackButtonConnected/>
                <ForwardButtonConnected/>
                <MenuButtonConnected/>
                <SearchButtonConnected/>
                <TabsButtonConnected/>
            </View>
        );
    }
}