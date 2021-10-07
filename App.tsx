import React from 'react';
import {Provider} from 'react-redux';
import {View, Text} from 'react-native';
import {store} from './src/store/store';
import {BrowserViewControllerConnected} from './src/browser/BrowserViewController.tsx';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Blog} from './src/browser/Blog.tsx';
import {About} from './src/browser/About.tsx';
import {Games} from './src/browser/Games.tsx';
import {Experiments} from './src/browser/Experiments.tsx';
import {Music} from './src/browser/Music.tsx';
// import Blog from '../screens/Blog.tsx';
// import Experiments from '../screens/Experiments.tsx';
// import Games from '../screens/Games.tsx';
// import Music from '../screens/Music.tsx';

interface Props {}

interface State {}
class AppContainer extends React.Component<Props, State> {
  render() {
    const {} = this.props;
    const Stack = createNativeStackNavigator();

    const NavigationContainer1 = () => {
      return (
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          {/* <Stack.Screen name="Home" component={Home} /> */}
          {/* <Stack.Screen name="Home">
            {props => (
              <Home
                {...props}
                webView={barAwareWebView({
                  headerConfig: config.header,
                  scrollY: this.scrollY,
                  scrollEndDragVelocity: this.scrollEndDragVelocity,
                  navigation: props.navigation,
                })}
              />
            )}
          </Stack.Screen> */}
          <Stack.Screen
            name="Home"
            component={BrowserViewControllerConnected}
          />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Music" component={Music} />
          <Stack.Screen name="Experiments" component={Experiments} />
          <Stack.Screen name="Games" component={Games} />
          <Stack.Screen name="Blog" component={Blog} />
          {/* <Stack.Screen name="About">
            {props => (
              <About
                {...props}
                webView={barAwareWebView({
                  headerConfig: config.header,
                  scrollY: this.scrollY,
                  scrollEndDragVelocity: this.scrollEndDragVelocity,
                  navigation: props.navigation,
                })}
              />
            )}
          </Stack.Screen> */}
          {/* <Stack.Screen name="Blog">
            {props => (
              <Blog
                {...props}
                webView={barAwareWebView({
                  headerConfig: config.header,
                  scrollY: this.scrollY,
                  scrollEndDragVelocity: this.scrollEndDragVelocity,
                  navigation: props.navigation,
                })}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Experiments">
            {props => (
              <Experiments
                {...props}
                webView={barAwareWebView({
                  headerConfig: config.header,
                  scrollY: this.scrollY,
                  scrollEndDragVelocity: this.scrollEndDragVelocity,
                  navigation: props.navigation,
                })}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Games">
            {props => <Games {...props} webView={mainWebView} />}
          </Stack.Screen>
          <Stack.Screen name="Music">
            {props => (
              <Music
                {...props}
                webView={barAwareWebView({
                  headerConfig: config.header,
                  scrollY: this.scrollY,
                  scrollEndDragVelocity: this.scrollEndDragVelocity,
                  navigation: props.navigation,
                })}
              />
            )}
          </Stack.Screen> */}
          {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
        </Stack.Navigator>
      );
    };

    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer>
            {/* <BrowserViewControllerConnected /> */}
            <NavigationContainer1 />
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    );
  }
}

export default AppContainer;
