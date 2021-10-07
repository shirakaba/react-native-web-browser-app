import * as React from 'react';
import {ViewProps} from 'react-native';
import Animated from 'react-native-reanimated';
import {
  EdgeInsets,
  SafeAreaInsetsContext,
} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {
  GRADIENT_PROGRESS_BAR_HEIGHT,
  defaultGradientProgressBar,
} from '../../browser/header/GradientProgressBar';
import {WholeStoreState} from '../../store/store';
import {HeaderConfig} from '../browserConfig';
import {RetractionStyle} from '../bothBars/BarConfig';
import {defaultHeader} from './Header';
import {
  DEFAULT_HEADER_RETRACTED_HEIGHT,
  DEFAULT_HEADER_REVEALED_HEIGHT,
} from './TabLocationView';
import {URL_BAR_VIEW_PADDING_VERTICAL} from './URLBarView';
const {interpolate, Extrapolate} = Animated;

interface RetractibleHeaderProps {
  config: HeaderConfig;
  scrollY: number;

  urlBarText: string;
  orientation: 'portrait' | 'landscape';
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L61
// Formerly named "NotchAreaCover".
export class RetractibleHeader extends React.Component<
  RetractibleHeaderProps & Omit<ViewProps, 'orientation'>,
  {}
> {
  private readonly animatedNavBarTranslateYPortrait: number;
  private readonly animatedNavBarTranslateYLandscape: number;
  private readonly animatedTitleOpacity: number;

  constructor(props: RetractibleHeaderProps & Omit<ViewProps, 'orientation'>) {
    super(props);

    const {config} = props;
    const {
      landscapeRetraction,
      portraitRetraction,
      HEADER_RETRACTED_HEIGHT = DEFAULT_HEADER_RETRACTED_HEIGHT,
      HEADER_REVEALED_HEIGHT = DEFAULT_HEADER_REVEALED_HEIGHT,
    } = config;

    const HEADER_HIDDEN_HEIGHT: number = 0;
    const HEADER_RETRACTION_DISTANCE: number =
      HEADER_REVEALED_HEIGHT - HEADER_RETRACTED_HEIGHT;

    const input: Array<number> = [
      -HEADER_RETRACTION_DISTANCE,
      HEADER_RETRACTION_DISTANCE,
    ];
    const outputTranslateYPortrait: Array<number> = [
      HEADER_RETRACTED_HEIGHT,
      HEADER_REVEALED_HEIGHT,
    ];
    const outputTranslateYLandscape: Array<number> = [
      HEADER_HIDDEN_HEIGHT,
      HEADER_REVEALED_HEIGHT,
    ];
    const outputTitleOpacity: Array<number> = [0, 1];

    this.animatedNavBarTranslateYPortrait = interpolate(
      this.props.scrollY,
      input,
      outputTranslateYPortrait,
      Animated.Extrapolate.CLAMP,
    );

    this.animatedNavBarTranslateYLandscape = interpolate(
      this.props.scrollY,
      input,
      outputTranslateYLandscape,
      Animated.Extrapolate.CLAMP,
    );

    this.animatedTitleOpacity = Animated.interpolate(
      this.props.scrollY,
      input,
      outputTitleOpacity,
      Animated.Extrapolate.CLAMP,
    );
  }

  render() {
    return (
      <SafeAreaInsetsContext.Consumer>
        {(edgeInsets: EdgeInsets) => {
          const {
            config,
            orientation,
            scrollY,
            urlBarText,
            style,
            children,
            ...rest
          } = this.props;
          const {
            contentView = defaultHeader,
            progressBar = defaultGradientProgressBar,
            backgroundColor,
            landscapeRetraction,
            portraitRetraction,
            progressBarTrackColor,
            HEADER_RETRACTED_HEIGHT = DEFAULT_HEADER_RETRACTED_HEIGHT,
            HEADER_REVEALED_HEIGHT = DEFAULT_HEADER_REVEALED_HEIGHT,
          } = config;
          const HEADER_HIDDEN_HEIGHT: number = 0;
          const retractionStyle: RetractionStyle =
            orientation === 'portrait'
              ? portraitRetraction
              : landscapeRetraction;

          const unsafeAreaCoverHeight: number = edgeInsets.top;

          let heightStyle;
          switch (retractionStyle) {
            case RetractionStyle.alwaysRevealed:
            case RetractionStyle.retractToCompact:
            case RetractionStyle.alwaysCompact:
              heightStyle = {
                height: 'auto',
              };
              break;
            case RetractionStyle.retractToHidden:
              heightStyle = {
                height: Animated.interpolate(
                  this.animatedNavBarTranslateYLandscape,
                  {
                    inputRange: [HEADER_HIDDEN_HEIGHT, HEADER_REVEALED_HEIGHT],
                    outputRange: [
                      HEADER_HIDDEN_HEIGHT,
                      HEADER_REVEALED_HEIGHT +
                        URL_BAR_VIEW_PADDING_VERTICAL * 2 +
                        edgeInsets.top +
                        GRADIENT_PROGRESS_BAR_HEIGHT,
                    ],
                    extrapolate: Extrapolate.CLAMP,
                  },
                ),
              };
              break;
            case RetractionStyle.alwaysHidden:
              heightStyle = {
                height: HEADER_HIDDEN_HEIGHT,
              };
          }

          return (
            <Animated.View
              style={[
                {
                  flexDirection: 'column',
                  // Best to be flex-end (stack children upon bottom edge) so that the loading bar hangs on the edge.
                  justifyContent: 'flex-end',
                  // alignItems: "center",
                  width: '100%',
                  backgroundColor,

                  paddingTop: edgeInsets.top,
                },
                heightStyle,
              ]}
              {...rest}>
              {contentView({
                config,
                scrollY,
                animatedNavBarTranslateYLandscape:
                  this.animatedNavBarTranslateYLandscape,
                animatedNavBarTranslateYPortrait:
                  this.animatedNavBarTranslateYPortrait,
                animatedTitleOpacity: this.animatedTitleOpacity,
                toolbarIsShowing: orientation === 'landscape',
                inOverlayMode: false,
                style: {
                  paddingLeft: edgeInsets.left,
                  paddingRight: edgeInsets.right,
                },
              })}
              {progressBar({trackColor: progressBarTrackColor})}
            </Animated.View>
          );
        }}
      </SafeAreaInsetsContext.Consumer>
    );
  }
}

export const RetractibleHeaderConnected = connect(
  (wholeStoreState: WholeStoreState) => {
    // console.log(`wholeStoreState`, wholeStoreState);
    return {
      urlBarText: wholeStoreState.navigation.urlBarText,
      orientation: wholeStoreState.ui.orientation,
    };
  },
  {},
)(RetractibleHeader);
