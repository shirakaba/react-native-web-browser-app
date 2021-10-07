import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { BrowserViewControllerConnected } from './src/browser/BrowserViewController.tsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Blog } from './src/browser/Blog.tsx';
import { About } from './src/browser/About.tsx';
import { Games } from './src/browser/Games.tsx';
import { Experiments } from './src/browser/Experiments.tsx';
import { Music } from './src/browser/Music.tsx';
class AppContainer extends React.Component {
    render() {
        const {} = this.props;
        const Stack = createNativeStackNavigator();
        const NavigationContainer1 = () => {
            return (React.createElement(Stack.Navigator, { initialRouteName: "Home", screenOptions: {
                    headerShown: false,
                } },
                React.createElement(Stack.Screen, { name: "Home", component: BrowserViewControllerConnected }),
                React.createElement(Stack.Screen, { name: "About", component: About }),
                React.createElement(Stack.Screen, { name: "Music", component: Music }),
                React.createElement(Stack.Screen, { name: "Experiments", component: Experiments }),
                React.createElement(Stack.Screen, { name: "Games", component: Games }),
                React.createElement(Stack.Screen, { name: "Blog", component: Blog })));
        };
        return (React.createElement(SafeAreaProvider, null,
            React.createElement(Provider, { store: store },
                React.createElement(NavigationContainer, null,
                    React.createElement(NavigationContainer1, null)))));
    }
}
export default AppContainer;
//# sourceMappingURL=App.js.map