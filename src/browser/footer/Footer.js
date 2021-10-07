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
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) {
              d[p] = b[p];
            }
          }
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null) {
        throw new TypeError(
          'Class extends value ' + String(b) + ' is not a constructor or null',
        );
      }
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
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) {
        t[p] = s[p];
      }
    }
    if (s != null && typeof Object.getOwnPropertySymbols === 'function') {
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        ) {
          t[p[i]] = s[p[i]];
        }
      }
    }
    return t;
  };
exports.__esModule = true;
exports.FooterConnected =
  exports.Footer =
  exports.DEFAULT_FOOTER_REVEALED_HEIGHT =
    void 0;
var React = require('react');
var react_native_1 = require('react-native');
var react_native_reanimated_1 = require('react-native-reanimated');
var react_native_safe_area_context_1 = require('react-native-safe-area-context');
var react_redux_1 = require('react-redux');
var BarConfig_1 = require('../bothBars/BarConfig');
var TabLocationView_1 = require('../header/TabLocationView');
var TabToolbar_1 = require('./TabToolbar');
var diffClamp = react_native_reanimated_1.default.diffClamp,
  interpolate = react_native_reanimated_1.default.interpolateNode,
  reanimatedEvent = react_native_reanimated_1.default.event,
  multiply = react_native_reanimated_1.default.multiply,
  add = react_native_reanimated_1.default.add,
  cond = react_native_reanimated_1.default.cond,
  lessThan = react_native_reanimated_1.default.lessThan,
  neq = react_native_reanimated_1.default.neq,
  Clock = react_native_reanimated_1.default.Clock,
  Extrapolate = react_native_reanimated_1.default.Extrapolate,
  clockRunning = react_native_reanimated_1.default.clockRunning,
  set = react_native_reanimated_1.default.set,
  startClock = react_native_reanimated_1.default.startClock,
  spring = react_native_reanimated_1.default.spring,
  sub = react_native_reanimated_1.default.sub,
  stopClock = react_native_reanimated_1.default.stopClock,
  eq = react_native_reanimated_1.default.eq;
// export const FOOTER_RETRACTED_HEIGHT: number = 22;
exports.DEFAULT_FOOTER_REVEALED_HEIGHT = 44;
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L103
var Footer = /** @class */ (function (_super) {
  __extends(Footer, _super);
  function Footer() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  Footer.prototype.render = function () {
    var _this = this;
    var _a = this.props,
      config = _a.config,
      showToolbar = _a.showToolbar,
      orientation = _a.orientation,
      children = _a.children,
      rest = __rest(_a, ['config', 'showToolbar', 'orientation', 'children']);
    var backgroundColor = config.backgroundColor,
      _b = config.contentView,
      contentView = _b === void 0 ? TabToolbar_1.defaultTabToolbar : _b,
      landscapeRetraction = config.landscapeRetraction,
      portraitRetraction = config.portraitRetraction,
      _c = config.FOOTER_REVEALED_HEIGHT,
      FOOTER_REVEALED_HEIGHT =
        _c === void 0 ? exports.DEFAULT_FOOTER_REVEALED_HEIGHT : _c,
      _d = config.HEADER_REVEALED_HEIGHT,
      HEADER_REVEALED_HEIGHT =
        _d === void 0 ? TabLocationView_1.DEFAULT_HEADER_REVEALED_HEIGHT : _d,
      _e = config.HEADER_RETRACTED_HEIGHT,
      HEADER_RETRACTED_HEIGHT =
        _e === void 0 ? TabLocationView_1.DEFAULT_HEADER_RETRACTED_HEIGHT : _e;
    var retractionStyle =
      orientation === 'portrait' ? portraitRetraction : landscapeRetraction;
    var HEADER_RETRACTION_DISTANCE =
      HEADER_REVEALED_HEIGHT - HEADER_RETRACTED_HEIGHT;
    var FOOTER_HIDDEN_HEIGHT = 0;
    if (showToolbar) {
      /* Warning: I've tried other layouts (StackLayout and FlexboxLayout) here, but they shift
       * horizontally after rotation. Only ContentView seems to escape this bug. */
      return (
        <react_native_safe_area_context_1.SafeAreaInsetsContext.Consumer>
          {function (edgeInsets) {
            var unsafeAreaCoverHeight = edgeInsets.bottom;
            var heightStyle;
            switch (retractionStyle) {
              case BarConfig_1.RetractionStyle.alwaysRevealed:
                heightStyle = {
                  // height: "auto",
                  height: FOOTER_REVEALED_HEIGHT + unsafeAreaCoverHeight,
                };
                break;
              // case RetractionStyle.retractToCompact:
              case BarConfig_1.RetractionStyle.retractToHidden:
                heightStyle = {
                  height: interpolate(_this.props.scrollY, {
                    inputRange: [
                      -HEADER_RETRACTION_DISTANCE,
                      HEADER_RETRACTION_DISTANCE,
                    ],
                    outputRange: [
                      FOOTER_HIDDEN_HEIGHT,
                      add(FOOTER_REVEALED_HEIGHT, unsafeAreaCoverHeight),
                    ],
                    extrapolate: Extrapolate.CLAMP,
                  }),
                };
                break;
              case BarConfig_1.RetractionStyle.alwaysHidden:
                heightStyle = {
                  height: FOOTER_HIDDEN_HEIGHT,
                };
            }
            return (
              <react_native_reanimated_1.default.View
                style={[
                  {
                    flexDirection: 'column',
                    width: '100%',
                    backgroundColor: backgroundColor,
                    /* Combine this with auto height. */
                    // paddingBottom: unsafeAreaCoverHeight,
                    paddingLeft: edgeInsets.left,
                    paddingRight: edgeInsets.right,
                  },
                  heightStyle,
                ]}
                // height={{ value: animatedHeight, unit: "dip" }}
                {...rest}>
                {contentView({config: config})}
                {/* <ContentView config={config}/> */}
              </react_native_reanimated_1.default.View>
            );
          }}
        </react_native_safe_area_context_1.SafeAreaInsetsContext.Consumer>
      );
    }
    // Unclear what footer should do when not showing toolbar...
    return <react_native_1.View />;
  };
  return Footer;
})(React.Component);
exports.Footer = Footer;
exports.FooterConnected = (0, react_redux_1.connect)(function (
  wholeStoreState,
) {
  // console.log(`wholeStoreState`, wholeStoreState);
  return {
    orientation: wholeStoreState.ui.orientation,
  };
},
{})(Footer);
