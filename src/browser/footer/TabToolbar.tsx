import * as React from "react";
import { View, ViewProps, ViewStyle } from "react-native";
import { BackButtonConnected, ForwardButtonConnected, MenuButtonConnected, SearchButtonConnected, TabsButtonConnected, } from "../bothBars/BarButtons";
import { HeaderConfig } from "../browserConfig";

export interface TabToolbarOwnProps {
    config: HeaderConfig,
    containerStyle?: ViewStyle,
}

export type TabToolbarProps = TabToolbarOwnProps & ViewProps;
export type TabToolbarType = (props: TabToolbarProps) => React.ReactNode;
export const defaultTabToolbar = (props: TabToolbarProps) => <TabToolbar {...props}/>;

interface State {

}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabToolbar.swift#L199
export class TabToolbar extends React.Component<TabToolbarProps, State>{

    render(){
        const { config, containerStyle, ...rest } = this.props;

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
                    containerStyle
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