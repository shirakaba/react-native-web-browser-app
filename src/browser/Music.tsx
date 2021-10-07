import * as React from 'react';
import {Dimensions, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import {BrowserConfig, defaultConfig} from './browserConfig.tsx';
import {WholeStoreState} from '../store/store';
import {isPortrait, updateOrientation} from '../store/uiState';
import {DRAG_END_INITIAL} from './bothBars/barSpring';
import {FooterConnected} from './footer/Footer';
import {RetractibleHeaderConnected} from './header/RetractibleHeader';
import {
  DEFAULT_HEADER_RETRACTED_HEIGHT,
  DEFAULT_HEADER_REVEALED_HEIGHT,
} from './header/TabLocationView';
import {DefaultBarAwareWebView} from './webView/BarAwareWebView';
import {WebViewBackdrop} from './webView/WebViewBackdrop';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import Home from '../screens/Home.tsx';
// import About from '../screens/About.tsx';
// import Blog from '../screens/Blog.tsx';
// import Experiments from '../screens/Experiments.tsx';
// import Games from '../screens/Games.tsx';
// import Music from '../screens/Music.tsx';

const BrowserViewControllerUX = {
  ShowHeaderTapAreaHeight: 0,
  BookmarkStarAnimationDuration: 0.5,
  BookmarkStarAnimationOffset: 80,
};

// // https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L70
// class AlertStackView extends React.Component<ViewProps, {}> {
//     render(){
//         const { style, children, ...rest } = this.props;

//         return (
//             <View
//                 style={StyleSheet.compose(
//                     {
//                         flexDirection: "column",
//                     },
//                     style
//                 )}
//                 {...rest}
//             />
//         );
//     }
// }

// // https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L65
// class OverlayBackground extends React.Component<ViewProps, {}> {
//     render(){
//         const { style, ...rest } = this.props;

//         return (
//             // UIVisualEffectView()
//             <View
//                 style={StyleSheet.compose(
//                     {
//                         flexDirection: "column",
//                     },
//                     style
//                 )}
//             />
//         );
//     }
// }

interface Props {
  config?: BrowserConfig;
  updateOrientation: typeof updateOrientation;
}

interface State {}

export class Music extends React.Component<Props, State> {
  private readonly scrollY;
  private readonly scrollEndDragVelocity = new Animated.Value(DRAG_END_INITIAL);

  constructor(props: Props) {
    super(props);

    const {config = defaultConfig} = props;
    const {
      HEADER_RETRACTED_HEIGHT = DEFAULT_HEADER_RETRACTED_HEIGHT,
      HEADER_REVEALED_HEIGHT = DEFAULT_HEADER_REVEALED_HEIGHT,
    } = config.header;
    const HEADER_RETRACTION_DISTANCE: number =
      HEADER_REVEALED_HEIGHT - HEADER_RETRACTED_HEIGHT;

    this.scrollY = new Animated.Value(HEADER_RETRACTION_DISTANCE);
  }

  private readonly onOrientationChange = () => {
    this.props.updateOrientation(isPortrait() ? 'portrait' : 'landscape');
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this.onOrientationChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onOrientationChange);
  }

  render() {
    const {config = defaultConfig} = this.props;
    const {barAwareWebView = DefaultBarAwareWebView} = config;
    // Visibility of certain components changes when switching app (if in private browsing mode)
    // https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/BrowserViewController.swift#L343

    // const Stack = createNativeStackNavigator();

    // const mainWebView = url => {
    //   console.log('URL IN FUNCTION==========>', url);

    //   barAwareWebView({
    //     headerConfig: config.header,
    //     scrollY: this.scrollY,
    //     scrollEndDragVelocity: this.scrollEndDragVelocity,
    //     URL: url,
    //   });
    // };

    return (
      <View
        // stretchLastChild={true}
        style={{
          flex: 1,
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}>
        <RetractibleHeaderConnected
          config={config.header}
          scrollY={this.scrollY}
        />

        <View
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            flexGrow: 1,
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              width: '100%',
            }}>
            <WebViewBackdrop
              style={{
                position: 'absolute',
              }}
            />

            {barAwareWebView({
              headerConfig: config.header,
              scrollY: this.scrollY,
              scrollEndDragVelocity: this.scrollEndDragVelocity,
              URL: 'https://birchlabs.co.uk/music',
              navigation: this.props.navigation,
            })}
          </View>

          <FooterConnected
            config={config.footer}
            scrollY={this.scrollY}
            showToolbar={true}
          />
        </View>
      </View>
    );
  }
}

export const BrowserViewControllerConnected = connect(
  (wholeStoreState: WholeStoreState) => {
    // console.log(`wholeStoreState`, wholeStoreState);
    return {};
  },
  {
    updateOrientation: updateOrientation,
  },
)(Music);
