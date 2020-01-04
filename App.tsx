import React from "react";
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { BrowserViewControllerConnected } from "./src/browser/BrowserViewController";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Props {
}

interface State {
}

class AppContainer extends React.Component<Props, State> {
    render(){
        const { } = this.props;

        return (
            <SafeAreaProvider>
                <Provider store={store}>
                    <BrowserViewControllerConnected/>
                </Provider>
            </SafeAreaProvider>
        );
    }
}

export default AppContainer;