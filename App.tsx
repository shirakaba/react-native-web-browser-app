import React from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
// import { BrowserViewController } from '~/browser/BrowserViewController';
import { Provider } from 'react-redux';
import { store } from '~/store/store';

function isPortrait(): boolean {
    const { width, height } = Dimensions.get('screen');
    return height >= width;
};

interface Props {
}

interface State {
    orientation: "portrait"|"landscape",
}

class AppContainer extends React.Component<Props, State> {
    constructor(props){
        super(props);

        this.state = {
            orientation: isPortrait() ? 'portrait' : 'landscape',
        };
    }

    private readonly onOrientationChange = () => {
        this.setState({
            orientation: isPortrait() ? 'portrait' : 'landscape'
        });
    };

    componentDidMount(){
        Dimensions.addEventListener('change', this.onOrientationChange);
        
        // const page: Page = this.props.forwardedRef.current!;
        // page.addCssFile("./components/AppContainer.scss"); // Path is relative to the 'app' folder; not relative to this file!
    }
    
    componentWillUnmount(){
        Dimensions.removeEventListener('change', this.onOrientationChange);
    }

    render(){
        const { } = this.props;
        const { orientation } = this.state;

        return (
            <Provider store={store}>
                <View style={styles.container}>
                    {/* <BrowserViewController orientation={orientation}/> */}
                    <Text>AppContainer</Text>
                </View>
            </Provider>
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
