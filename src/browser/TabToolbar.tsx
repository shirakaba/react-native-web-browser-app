import * as React from "react";
import { $FlexboxLayout } from "react-nativescript";
import { BackButtonConnected, ForwardButtonConnected, MenuButtonConnected, SearchButtonConnected, TabsButtonConnected, } from "./BarButtons";
import { FlexboxLayoutComponentProps } from "react-nativescript/dist/components/FlexboxLayout";

interface Props {

}

interface State {

}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabToolbar.swift#L199
export class TabToolbar extends React.Component<Props & FlexboxLayoutComponentProps, State>{

    render(){
        const { ...rest } = this.props;
        return (
            <$FlexboxLayout
                flexDirection={"row"}
                justifyContent={"space-around"}
                alignItems={"center"}
                width={{ value: 100, unit: "%" }}
                // paddingTop={16}
                {...rest}
            >
                {/* actionButtons */}
                <BackButtonConnected/>
                <ForwardButtonConnected/>
                <MenuButtonConnected/>
                <SearchButtonConnected/>
                <TabsButtonConnected/>
            </$FlexboxLayout>
        );
    }
}