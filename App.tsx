import React from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
// import { BrowserViewController } from '~/browser/BrowserViewController';
import { Provider } from 'react-redux';
import { store } from '~/store/store';
import { BrowserViewControllerConnected } from "~/browser/BrowserViewController";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Props {
}

interface State {
}

class AppContainer extends React.Component<Props, State> {
    render(){
        const { } = this.props;
        const { } = this.state;

        return (
            <SafeAreaProvider>
                <Provider store={store}>
                    <View style={styles.container}>
                        <BrowserViewControllerConnected/>
                        {/* <Text>AppContainer</Text> */}
                    </View>
                </Provider>
            </SafeAreaProvider>
        );
    }
}

export default AppContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
