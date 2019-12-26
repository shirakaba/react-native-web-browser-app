import * as React from "react";
import { Text, ViewStyle, StyleSheet, TouchableOpacity, TouchableOpacityProps, StyleProp } from "react-native";

interface Props {
    style?: ViewStyle,
    text?: string,
    onTap?: () => void,
}

interface State {
}

// https://github.com/cliqz/user-agent-ios/blob/7a91b5ea3e2fbb8b95dadd4f0cfd71b334e73449/Client/Frontend/Browser/TabToolbar.swift#L146
export class ToolbarButton extends React.Component<Props & TouchableOpacityProps, State>{
    render(){
        const { style, onTap, text = "", children, ...rest } = this.props;
        
        const textColour: string = "white";

        // TODO: check whether backgroundColor is working as intended
        // const { backgroundColor = "transparent" } = StyleSheet.flatten(style);

        return (
            <TouchableOpacity
                onPress={onTap}
                style={[
                    {
                        width: 40,
                        height: 40,
                        // backgroundColor,
                    },
                    style,
                ]}
                {...rest}
            >
                <Text
                    style={{
                        color: textColour,
                        // backgroundColor,
                        fontFamily: "Font Awesome 5 Free",
                    }}
                >
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }
}