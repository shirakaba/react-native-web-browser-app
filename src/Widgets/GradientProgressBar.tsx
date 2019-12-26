import * as React from "react";
import { $Progress } from "react-nativescript";
import { ProgressComponentProps } from "react-nativescript/dist/components/Progress";
import { connect } from 'react-redux';
import { WholeStoreState } from "~/store/store";

interface Props {
    progress: number,
}

type GradientProgressBarProps = Props & ProgressComponentProps;

interface State {
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift
class GradientProgressBar extends React.Component<GradientProgressBarProps, State>{
    render(){
        const { progress, ...rest } = this.props;

        return (
            <$Progress
                value={progress}
                maxValue={1}
                opacity={progress === 1 ? 0 : 1}
                // This is declared in app/components/AppContainer.scss
                className={progress === 1 ? "fade-out-anim" : ""}
                {...rest}
            />
        );
    }
}

export const GradientProgressBarConnected = connect(
    (wholeStoreState: WholeStoreState) => {
        // console.log(`wholeStoreState`, wholeStoreState);
        const { activeTab, tabs } = wholeStoreState.navigation;

        return {
            progress: tabs[activeTab].loadProgress,
        };
    },
    {},
)(GradientProgressBar);