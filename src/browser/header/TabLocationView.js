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
exports.TabLocationViewConnected =
  exports.TabLocationView =
  exports.DEFAULT_HEADER_REVEALED_HEIGHT =
  exports.DEFAULT_HEADER_RETRACTED_HEIGHT =
    void 0;
var React = require('react');
var react_native_1 = require('react-native');
var ToolbarButton_1 = require('../bothBars/ToolbarButton');
var PrivacyIndicatorView_1 = require('../../browser/header/PrivacyIndicatorView');
var react_redux_1 = require('react-redux');
var navigationState_1 = require('../../store/navigationState');
var react_native_reanimated_1 = require('react-native-reanimated');
var BarConfig_1 = require('../bothBars/BarConfig');
var TabLocationViewUX = {
  Spacing: 8,
  PlaceholderLefPadding: 12,
  StatusIconSize: 18,
  TPIconSize: 24,
  ButtonSize: 44,
  URLBarPadding: 4,
};
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L83
var LockImageView = /** @class */ (function (_super) {
  __extends(LockImageView, _super);
  function LockImageView() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  LockImageView.prototype.render = function () {
    var _a = this.props,
      locked = _a.locked,
      rest = __rest(_a, ['locked']);
    return (
      // <$Image/>
      <ToolbarButton_1.ToolbarButton
        name={locked ? 'lock' : 'lock-open'}
        {...rest}
      />
    );
  };
  return LockImageView;
})(React.Component);
var ClearUrlBarTextButton = /** @class */ (function (_super) {
  __extends(ClearUrlBarTextButton, _super);
  function ClearUrlBarTextButton() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.onClearButtonPress = function () {
      _this.props.updateUrlBarText({text: '', fromNavigationEvent: false});
    };
    return _this;
  }
  ClearUrlBarTextButton.prototype.render = function () {
    var _a = this.props,
      urlBarText = _a.urlBarText,
      light = _a.light,
      brand = _a.brand,
      rest = __rest(_a, ['urlBarText', 'light', 'brand']);
    return (
      <ToolbarButton_1.ToolbarButton
        onPress={this.onClearButtonPress}
        name={'times-circle'}
        solid
        {...rest}
      />
    );
  };
  return ClearUrlBarTextButton;
})(React.Component);
var ClearUrlBarTextButtonConnected = (0, react_redux_1.connect)(
  function (wholeStoreState) {
    // console.log(`wholeStoreState`, wholeStoreState);
    var urlBarText = wholeStoreState.navigation.urlBarText;
    return {
      urlBarText: urlBarText,
    };
  },
  {
    updateUrlBarText: navigationState_1.updateUrlBarText,
  },
)(ClearUrlBarTextButton);
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L319
var DisplayTextField = /** @class */ (function (_super) {
  __extends(DisplayTextField, _super);
  function DisplayTextField() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.onChangeText = function (text) {
      _this.props.updateUrlBarText({text: text, fromNavigationEvent: false});
    };
    _this.onSubmitEditing = function (e) {
      _this.props.submitUrlBarTextToWebView(
        e.nativeEvent.text,
        _this.props.activeTab,
      );
    };
    return _this;
  }
  DisplayTextField.prototype.render = function () {
    var _a = this.props,
      urlBarText = _a.urlBarText,
      style = _a.style,
      rest = __rest(_a, ['urlBarText', 'style']);
    return (
      <react_native_1.TextInput
        style={react_native_1.StyleSheet.compose(
          {
            /* Note: I suspect that Safari may use fontSize 16. */
            fontSize: 18,
            flex: 1,
          },
          style,
        )}
        {...rest}
        value={urlBarText}
        autoCorrect={false}
        autoCapitalize={'none'}
        keyboardType={'url'}
        returnKeyType={'go'}
        onChangeText={this.onChangeText}
        placeholder={'Search or enter address'}
        onSubmitEditing={this.onSubmitEditing}
      />
    );
  };
  return DisplayTextField;
})(React.Component);
var DisplayTextFieldConnected = (0, react_redux_1.connect)(
  function (wholeStoreState) {
    // console.log(`wholeStoreState`, wholeStoreState);
    var _a = wholeStoreState.navigation,
      activeTab = _a.activeTab,
      urlBarText = _a.urlBarText;
    return {
      activeTab: activeTab,
      urlBarText: urlBarText,
    };
  },
  {
    updateUrlBarText: navigationState_1.updateUrlBarText,
    submitUrlBarTextToWebView: navigationState_1.submitUrlBarTextToWebView,
  },
)(DisplayTextField);
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L62
var UrlTextField = /** @class */ (function (_super) {
  __extends(UrlTextField, _super);
  function UrlTextField() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  UrlTextField.prototype.render = function () {
    var rest = __rest(this.props, []);
    return (
      <DisplayTextFieldConnected {...rest} />
      // <DisplayTextField urlBarText={"whatever"} {...rest}/>
    );
  };
  return UrlTextField;
})(React.Component);
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L111
var PageOptionsButton = /** @class */ (function (_super) {
  __extends(PageOptionsButton, _super);
  function PageOptionsButton() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  PageOptionsButton.prototype.render = function () {
    var rest = __rest(this.props, []);
    return <ToolbarButton_1.ToolbarButton {...rest} name={'ellipsis-h'} />;
  };
  return PageOptionsButton;
})(React.Component);
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L105
var PrivacyIndicator = /** @class */ (function (_super) {
  __extends(PrivacyIndicator, _super);
  function PrivacyIndicator() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  PrivacyIndicator.prototype.render = function () {
    var rest = __rest(this.props, []);
    return <PrivacyIndicatorView_1.PrivacyIndicatorView {...rest} />;
  };
  return PrivacyIndicator;
})(React.Component);
exports.DEFAULT_HEADER_RETRACTED_HEIGHT = 22;
exports.DEFAULT_HEADER_REVEALED_HEIGHT = 44;
// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift
var TabLocationView = /** @class */ (function (_super) {
  __extends(TabLocationView, _super);
  function TabLocationView() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  TabLocationView.prototype.render = function () {
    var _a = this.props,
      activeTabIsSecure = _a.activeTabIsSecure,
      urlBarText = _a.urlBarText,
      config = _a.config,
      orientation = _a.orientation,
      rest = __rest(_a, [
        'activeTabIsSecure',
        'urlBarText',
        'config',
        'orientation',
      ]);
    var _b = config.slotBackgroundColor,
      slotBackgroundColor = _b === void 0 ? 'darkgray' : _b,
      _c = config.textFieldTextColor,
      textFieldTextColor = _c === void 0 ? 'black' : _c,
      _d = config.textFieldBackgroundColor,
      textFieldBackgroundColor = _d === void 0 ? 'transparent' : _d,
      landscapeRetraction = config.landscapeRetraction,
      portraitRetraction = config.portraitRetraction,
      _e = config.HEADER_RETRACTED_HEIGHT,
      HEADER_RETRACTED_HEIGHT =
        _e === void 0 ? exports.DEFAULT_HEADER_RETRACTED_HEIGHT : _e,
      _f = config.HEADER_REVEALED_HEIGHT,
      HEADER_REVEALED_HEIGHT =
        _f === void 0 ? exports.DEFAULT_HEADER_REVEALED_HEIGHT : _f,
      buttonEnabledColor = config.buttonEnabledColor,
      buttonDisabledColor = config.buttonDisabledColor;
    var retractionStyle =
      orientation === 'portrait' ? portraitRetraction : landscapeRetraction;
    var HEADER_HIDDEN_HEIGHT = 0;
    var HEADER_RETRACTION_DISTANCE =
      HEADER_REVEALED_HEIGHT - HEADER_RETRACTED_HEIGHT;
    var heightStyle;
    switch (retractionStyle) {
      case BarConfig_1.RetractionStyle.alwaysRevealed:
        heightStyle = {
          // height: "auto",
          height: HEADER_REVEALED_HEIGHT,
        };
        break;
      case BarConfig_1.RetractionStyle.alwaysCompact:
        heightStyle = {
          height: HEADER_RETRACTED_HEIGHT,
        };
        break;
      case BarConfig_1.RetractionStyle.retractToCompact:
      case BarConfig_1.RetractionStyle.retractToHidden:
        heightStyle = {
          height: this.props.animatedNavBarTranslateYPortrait,
        };
        break;
      case BarConfig_1.RetractionStyle.alwaysHidden:
        heightStyle = {
          height: HEADER_HIDDEN_HEIGHT,
        };
    }
    // Where 1 is not compact and 0 is fully compact.
    var scaleFactor;
    switch (retractionStyle) {
      case BarConfig_1.RetractionStyle.alwaysRevealed:
        scaleFactor = 1;
        break;
      case BarConfig_1.RetractionStyle.alwaysHidden:
      case BarConfig_1.RetractionStyle.alwaysCompact:
        scaleFactor = 0;
        break;
      case BarConfig_1.RetractionStyle.retractToCompact:
      case BarConfig_1.RetractionStyle.retractToHidden:
        scaleFactor = this.props.animatedTitleOpacity;
        break;
    }
    return (
      /* self.view now flattened down to simplify UI. */
      /* self.contentView */
      /* https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift#L149 */
      /* https://developer.apple.com/documentation/uikit/uistackview */
      <react_native_reanimated_1.default.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            // margin: 8,
            flexGrow: 1,
            /* Mirrors that of the round-cornered backdrop view. */
            borderRadius: 10,
            marginHorizontal: 8,
          },
          heightStyle,
        ]}>
        {/* Simplest way to animate a backgroundColor fade-out with nativeDriver: introduce a backdrop view. */}
        <react_native_reanimated_1.default.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: 10,
            backgroundColor: slotBackgroundColor,
            opacity: scaleFactor,
          }}
        />

        {/* frontSpaceView */}
        <react_native_1.View style={{width: TabLocationViewUX.Spacing}} />

        {/* privacyIndicator */}
        <PrivacyIndicator
          enabledColor={buttonEnabledColor}
          disabledColor={buttonDisabledColor}
          containerStyle={{
            transform: [{scaleX: scaleFactor}, {scaleY: scaleFactor}],
          }}
        />

        {/* privacyIndicatorSeparator */}
        <react_native_1.View style={{width: 3}} />
        <LockImageView
          enabledColor={buttonEnabledColor}
          disabledColor={buttonDisabledColor}
          locked={!!activeTabIsSecure}
          containerStyle={{
            /* I'm not sure how ftp:// and sftp:// links are usually represented, so we'll hide the lock altogether. */
            display: activeTabIsSecure === null ? 'none' : 'flex',
            /* Nothing to do with animation; just my lazy way of making it more compact. */
            transform: [{scaleX: 0.66}, {scaleY: 0.66}],
          }}
        />
        <UrlTextField
          style={{
            color: textFieldTextColor,
            backgroundColor: textFieldBackgroundColor,
            flexGrow: 1,
          }}
        />
        <ClearUrlBarTextButtonConnected
          containerStyle={{
            /* TODO: hide this button altogether in compact mode. */
            display: urlBarText.length > 0 ? 'flex' : 'none',
            /* Nothing to do with animation; just my lazy way of making it more compact. */
            transform: [{scaleX: 0.8}, {scaleY: 0.8}],
          }}
        />
        <PageOptionsButton
          enabledColor={buttonEnabledColor}
          disabledColor={buttonDisabledColor}
          containerStyle={{
            transform: [{scaleX: scaleFactor}, {scaleY: scaleFactor}],
          }}
        />

        {/* Another spacer view */}
        <react_native_1.View style={{width: TabLocationViewUX.Spacing}} />
      </react_native_reanimated_1.default.View>
    );
  };
  return TabLocationView;
})(React.Component);
exports.TabLocationView = TabLocationView;
exports.TabLocationViewConnected = (0, react_redux_1.connect)(
  function (wholeStoreState) {
    // console.log(`wholeStoreState.navigation.urlBarText`, wholeStoreState.navigation.urlBarText);
    return {
      orientation: wholeStoreState.ui.orientation,
      urlBarText: wholeStoreState.navigation.urlBarText,
      activeTabIsSecure:
        wholeStoreState.navigation.tabs[wholeStoreState.navigation.activeTab]
          .isSecure,
    };
  },
  {
    updateUrlBarText: navigationState_1.updateUrlBarText,
  },
)(TabLocationView);
