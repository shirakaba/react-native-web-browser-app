'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError(
          'Class extends value ' + String(b) + ' is not a constructor or null',
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
exports.__esModule = true;
exports.ToolbarButton = void 0;
var React = require('react');
var react_native_1 = require('react-native');
var react_native_reanimated_1 = require('react-native-reanimated');
var FontAwesome5_1 = require('react-native-vector-icons/FontAwesome5');
// AnimateProps<ViewStyle, TouchableOpacityProps>
var AnimatedTouchableOpacity = react_native_reanimated_1[
  'default'
].createAnimatedComponent(react_native_1.TouchableOpacity);
// https://github.com/cliqz/user-agent-ios/blob/7a91b5ea3e2fbb8b95dadd4f0cfd71b334e73449/Client/Frontend/Browser/TabToolbar.swift#L146
var ToolbarButton = /** @class */ (function (_super) {
  __extends(ToolbarButton, _super);
  function ToolbarButton() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  ToolbarButton.prototype.render = function () {
    var _a = this.props,
      onTap = _a.onTap,
      containerStyle = _a.containerStyle,
      solid = _a.solid,
      light = _a.light,
      brand = _a.brand,
      _b = _a.enabled,
      enabled = _b === void 0 ? true : _b,
      _c = _a.name,
      name = _c === void 0 ? '' : _c,
      _d = _a.enabledColor,
      enabledColor = _d === void 0 ? 'white' : _d,
      _e = _a.disabledColor,
      disabledColor = _e === void 0 ? 'lightgray' : _e,
      children = _a.children,
      rest = __rest(_a, [
        'onTap',
        'containerStyle',
        'solid',
        'light',
        'brand',
        'enabled',
        'name',
        'enabledColor',
        'disabledColor',
        'children',
      ]);
    /** For what it's worth: iOS HIG for "Navigation Bar and Toolbar Icon Size" gives 24pt target size, 28pt max size.
     * @see: https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/custom-icons/ */
    /* Just a TypeScript hack here. */
    var assertOnlyOneVariantInProps = {
      solid: solid,
      light: light,
      brand: brand,
    };
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
          },
          containerStyle,
        ]}
        {...rest}>
        <FontAwesome5_1.default
          style={
            {
              // padding: 9,
              // fontFamily: "Font Awesome 5 Free",
            }
          }
          color={enabled ? enabledColor : disabledColor}
          size={20}
          {...assertOnlyOneVariantInProps}
          name={name}></FontAwesome5_1.default>
      </AnimatedTouchableOpacity>
    );
  };
  return ToolbarButton;
})(React.Component);
exports.ToolbarButton = ToolbarButton;
