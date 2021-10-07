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
exports.RetractibleHeaderConnected = exports.RetractibleHeader = void 0;
var React = require('react');
var react_native_reanimated_1 = require('react-native-reanimated');
var interpolate = react_native_reanimated_1.default.interpolateNode;
var react_native_safe_area_context_1 = require('react-native-safe-area-context');
var react_redux_1 = require('react-redux');
var GradientProgressBar_1 = require('../../browser/header/GradientProgressBar');
var BarConfig_1 = require('../bothBars/BarConfig');
var Header_1 = require('./Header');
var TabLocationView_1 = require('./TabLocationView');
var URLBarView_1 = require('./URLBarView');

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L61
// Formerly named "NotchAreaCover".
var RetractibleHeader = /** @class */ (function (_super) {
  __extends(RetractibleHeader, _super);
  function RetractibleHeader(props) {
    var _this = _super.call(this, props) || this;
    var config = props.config;
    var landscapeRetraction = config.landscapeRetraction,
      portraitRetraction = config.portraitRetraction,
      _a = config.HEADER_RETRACTED_HEIGHT,
      HEADER_RETRACTED_HEIGHT =
        _a === void 0 ? TabLocationView_1.DEFAULT_HEADER_RETRACTED_HEIGHT : _a,
      _b = config.HEADER_REVEALED_HEIGHT,
      HEADER_REVEALED_HEIGHT =
        _b === void 0 ? TabLocationView_1.DEFAULT_HEADER_REVEALED_HEIGHT : _b;
    var HEADER_HIDDEN_HEIGHT = 0;
    var HEADER_RETRACTION_DISTANCE =
      HEADER_REVEALED_HEIGHT - HEADER_RETRACTED_HEIGHT;
    var input = [-HEADER_RETRACTION_DISTANCE, HEADER_RETRACTION_DISTANCE];
    var outputTranslateYPortrait = [
      HEADER_RETRACTED_HEIGHT,
      HEADER_REVEALED_HEIGHT,
    ];
    var outputTranslateYLandscape = [
      HEADER_HIDDEN_HEIGHT,
      HEADER_REVEALED_HEIGHT,
    ];
    var outputTitleOpacity = [0, 1];
    _this.animatedNavBarTranslateYPortrait = interpolate(_this.props.scrollY, {
      inputRange: input,
      outputRange: outputTranslateYPortrait,
      extrapolate: react_native_reanimated_1.default.Extrapolate.CLAMP,
    });
    _this.animatedNavBarTranslateYLandscape = interpolate(_this.props.scrollY, {
      inputRange: input,
      outputRange: outputTranslateYLandscape,
      extrapolate: react_native_reanimated_1.default.Extrapolate.CLAMP,
    });
    _this.animatedTitleOpacity = interpolate(_this.props.scrollY, {
      inputRange: input,
      outputRange: outputTitleOpacity,
      extrapolate: react_native_reanimated_1.default.Extrapolate.CLAMP,
    });
    return _this;
  }
  RetractibleHeader.prototype.render = function () {
    var _this = this;
    return (
      <react_native_safe_area_context_1.SafeAreaInsetsContext.Consumer>
        {function (edgeInsets) {
          var _a = _this.props,
            config = _a.config,
            orientation = _a.orientation,
            scrollY = _a.scrollY,
            urlBarText = _a.urlBarText,
            style = _a.style,
            children = _a.children,
            rest = __rest(_a, [
              'config',
              'orientation',
              'scrollY',
              'urlBarText',
              'style',
              'children',
            ]);
          var _b = config.contentView,
            contentView = _b === void 0 ? Header_1.defaultHeader : _b,
            _c = config.progressBar,
            progressBar =
              _c === void 0
                ? GradientProgressBar_1.defaultGradientProgressBar
                : _c,
            backgroundColor = config.backgroundColor,
            landscapeRetraction = config.landscapeRetraction,
            portraitRetraction = config.portraitRetraction,
            progressBarTrackColor = config.progressBarTrackColor,
            _d = config.HEADER_RETRACTED_HEIGHT,
            HEADER_RETRACTED_HEIGHT =
              _d === void 0
                ? TabLocationView_1.DEFAULT_HEADER_RETRACTED_HEIGHT
                : _d,
            _e = config.HEADER_REVEALED_HEIGHT,
            HEADER_REVEALED_HEIGHT =
              _e === void 0
                ? TabLocationView_1.DEFAULT_HEADER_REVEALED_HEIGHT
                : _e;
          var HEADER_HIDDEN_HEIGHT = 0;
          var retractionStyle =
            orientation === 'portrait'
              ? portraitRetraction
              : landscapeRetraction;
          var unsafeAreaCoverHeight = edgeInsets.top;
          var heightStyle;
          switch (retractionStyle) {
            case BarConfig_1.RetractionStyle.alwaysRevealed:
            case BarConfig_1.RetractionStyle.retractToCompact:
            case BarConfig_1.RetractionStyle.alwaysCompact:
              heightStyle = {
                height: 'auto',
              };
              break;
            case BarConfig_1.RetractionStyle.retractToHidden:
              heightStyle = {
                height: interpolate(_this.animatedNavBarTranslateYLandscape, {
                  inputRange: [HEADER_HIDDEN_HEIGHT, HEADER_REVEALED_HEIGHT],
                  outputRange: [
                    HEADER_HIDDEN_HEIGHT,
                    HEADER_REVEALED_HEIGHT +
                      URLBarView_1.URL_BAR_VIEW_PADDING_VERTICAL * 2 +
                      edgeInsets.top +
                      GradientProgressBar_1.GRADIENT_PROGRESS_BAR_HEIGHT,
                  ],
                  extrapolate:
                    react_native_reanimated_1.default.Extrapolate.CLAMP,
                }),
              };
              break;
            case BarConfig_1.RetractionStyle.alwaysHidden:
              heightStyle = {
                height: HEADER_HIDDEN_HEIGHT,
              };
          }
          return (
            <react_native_reanimated_1.default.View
              style={[
                {
                  flexDirection: 'column',
                  // Best to be flex-end (stack children upon bottom edge) so that the loading bar hangs on the edge.
                  justifyContent: 'flex-end',
                  // alignItems: "center",
                  width: '100%',
                  backgroundColor: backgroundColor,
                  paddingTop: edgeInsets.top,
                },
                heightStyle,
              ]}
              {...rest}>
              {contentView({
                config: config,
                scrollY: scrollY,
                animatedNavBarTranslateYLandscape:
                  _this.animatedNavBarTranslateYLandscape,
                animatedNavBarTranslateYPortrait:
                  _this.animatedNavBarTranslateYPortrait,
                animatedTitleOpacity: _this.animatedTitleOpacity,
                toolbarIsShowing: orientation === 'landscape',
                inOverlayMode: false,
                style: {
                  paddingLeft: edgeInsets.left,
                  paddingRight: edgeInsets.right,
                },
              })}
              {progressBar({trackColor: progressBarTrackColor})}
            </react_native_reanimated_1.default.View>
          );
        }}
      </react_native_safe_area_context_1.SafeAreaInsetsContext.Consumer>
    );
  };
  return RetractibleHeader;
})(React.Component);
exports.RetractibleHeader = RetractibleHeader;
exports.RetractibleHeaderConnected = (0, react_redux_1.connect)(function (
  wholeStoreState,
) {
  // console.log(`wholeStoreState`, wholeStoreState);
  return {
    urlBarText: wholeStoreState.navigation.urlBarText,
    orientation: wholeStoreState.ui.orientation,
  };
},
{})(RetractibleHeader);
