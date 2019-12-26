import { hot } from 'react-hot-loader/root';
import * as React from "react";
import { $Page, $Label, $ActionBar, $GridLayout, $FormattedString, $Span, $Switch, $Frame } from "react-nativescript";
import { ItemSpec } from 'tns-core-modules/ui/layouts/grid-layout/grid-layout';
import { Frame, Page } from 'tns-core-modules/ui/frame/frame';
import { BrowserViewController } from '~/browser/BrowserViewController';
import { Application, OrientationChangedEventData, Screen } from "@nativescript/core";
import { Provider } from 'react-redux';
import { store } from '~/store/store';

interface Props {
    forwardedRef: React.RefObject<any>,
}

interface State {
    orientation: "portrait"|"landscape"|"unknown",
}

class AppContainer extends React.Component<Props, State> {
    constructor(props){
        super(props);

        this.state = {
            orientation: Application.orientation(),
        };
    }

    private readonly onOrientationChange = (args: OrientationChangedEventData) => {
        const orientation: "portrait"|"landscape"|"unknown" = args.newValue;
        this.setState({ orientation });
    };

    componentDidMount(){
        Application.on(Application.orientationChangedEvent, this.onOrientationChange);
        

        const page: Page = this.props.forwardedRef.current!;
        page.addCssFile("./components/AppContainer.scss"); // Path is relative to the 'app' folder; not relative to this file!
        return page;
    }
    
    componentWillUnmount(){
        Application.off(Application.orientationChangedEvent, this.onOrientationChange);
    }

    render(){
        const { forwardedRef } = this.props;
        const { orientation } = this.state;

        return (
            <Provider store={store}>
                <$Page ref={forwardedRef} actionBarHidden={true}>
                    <BrowserViewController orientation={orientation}/>
                    {/* <MyTextField backgroundColor={"orange"}/> */}
                </$Page>
            </Provider>
        );
    }
}

// export default AppContainer;
export default hot(AppContainer); // Replace this line with the above line if you want to remove hot loading.