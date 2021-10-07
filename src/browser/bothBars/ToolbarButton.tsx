import * as React from 'react';
import {
  RegisteredStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import Icon, {
  FontAwesome5IconProps,
} from 'react-native-vector-icons/FontAwesome5';

type ToolbarButtonContainerStyle =
  | RegisteredStyle<Animated.AnimateStyle<ViewStyle>>
  | Animated.AnimateStyle<ViewStyle>;
export type ToolbarButtonContainerStyleProp = {
  containerStyle?: ToolbarButtonContainerStyle;
};

export interface ToolbarButtonOwnProps {
  name?: string;
  onTap?: () => void;
  enabled?: boolean;
  enabledColor?: string;
  disabledColor?: string;
}

interface State {}

// AnimateProps<ViewStyle, TouchableOpacityProps>
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacity,
) as React.ComponentClass<
  Animated.AnimateProps<ViewStyle, TouchableOpacityProps>
>;

export type ToolbarButtonProps = ToolbarButtonOwnProps &
  Omit<TouchableOpacityProps & ToolbarButtonContainerStyleProp, 'style'> &
  Partial<FontAwesome5IconProps>;

// https://github.com/cliqz/user-agent-ios/blob/7a91b5ea3e2fbb8b95dadd4f0cfd71b334e73449/Client/Frontend/Browser/TabToolbar.swift#L146
export class ToolbarButton extends React.Component<ToolbarButtonProps, State> {
  render() {
    const {
      onTap,
      containerStyle,
      solid,
      light,
      brand,
      enabled = true,
      name = '',
      enabledColor = 'white',
      disabledColor = 'lightgray',
      children,
      ...rest
    } = this.props;

    /** For what it's worth: iOS HIG for "Navigation Bar and Toolbar Icon Size" gives 24pt target size, 28pt max size.
     * @see: https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/custom-icons/ */

    /* Just a TypeScript hack here. */
    const assertOnlyOneVariantInProps = {
      solid,
      light,
      brand,
    } as FontAwesome5IconProps;

    return (
      <AnimatedTouchableOpacity
        onPress={onTap}
        disabled={!enabled}
        style={[
          {
            width: 30,
            height: 30,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            // margin: 10
          },
          containerStyle,
        ]}
        {...rest}>
        <Icon
          style={
            {
              // padding: 9,
              // fontFamily: "Font Awesome 5 Free",
            }
          }
          color={enabled ? enabledColor : disabledColor}
          size={20}
          {...assertOnlyOneVariantInProps}
          name={name}></Icon>
      </AnimatedTouchableOpacity>
    );
  }
}
