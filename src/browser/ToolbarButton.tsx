import * as React from "react";
import { Text, ViewStyle, StyleSheet, TouchableOpacity, TouchableOpacityProps, StyleProp } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props {
    style?: StyleProp<ViewStyle>,
    name?: string,
    compact?: boolean,
    onTap?: () => void,
}

interface State {
}

// https://github.com/cliqz/user-agent-ios/blob/7a91b5ea3e2fbb8b95dadd4f0cfd71b334e73449/Client/Frontend/Browser/TabToolbar.swift#L146
export class ToolbarButton extends React.Component<Props & TouchableOpacityProps, State>{
    render(){
        const { style = {}, onTap, compact, name = "", children, ...rest } = this.props;
        
        const textColour: string = "white";

        console.log(`[ToolbarButton] compact: ${compact}`);

        /** For what it's worth: iOS HIG for "Navigation Bar and Toolbar Icon Size" gives 24pt target size, 28pt max size.
          * @see: https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/custom-icons/ */

        return (
            <TouchableOpacity
                onPress={onTap}
                style={StyleSheet.compose(
                    {
                        width: compact ? 24 : 28,
                        height: compact ? 24 : 28,
                        backgroundColor: "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                        // margin: 10
                    },
                    style
                )}
                {...rest}
            >
                <Icon
                    style={{
                        // padding: 9,
                        // fontFamily: "Font Awesome 5 Free",
                    }}
                    color={textColour}
                    size={compact ? 12 : 24}
                    
                    name={name}
                >
                </Icon>
            </TouchableOpacity>
        );
    }
}