import * as React from "react";
import { Text, ViewStyle, StyleSheet, TouchableOpacity, TouchableOpacityProps, StyleProp } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props {
    style?: StyleProp<ViewStyle>,
    name?: string,
    onTap?: () => void,
}

interface State {
}

// https://github.com/cliqz/user-agent-ios/blob/7a91b5ea3e2fbb8b95dadd4f0cfd71b334e73449/Client/Frontend/Browser/TabToolbar.swift#L146
export class ToolbarButton extends React.Component<Props & TouchableOpacityProps, State>{
    render(){
        const { style = {}, onTap, name = "", children, ...rest } = this.props;
        
        const textColour: string = "white";

        // TODO: check whether backgroundColor is working as intended, then simplify
        const { backgroundColor = "transparent", ...styleRest } = StyleSheet.flatten(style);

        return (
            <TouchableOpacity
                onPress={onTap}
                style={StyleSheet.compose(
                    {
                        width: 40,
                        height: 40,
                        backgroundColor,
                    },
                    {
                        ...styleRest
                    }
                )}
                {...rest}
            >
                <Icon
                    style={{
                        backgroundColor,
                        // fontFamily: "Font Awesome 5 Free",
                    }}
                    color={textColour}
                    size={20}
                    name={name}
                >
                </Icon>
            </TouchableOpacity>
        );
    }
}