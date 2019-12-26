import * as React from "react";
import { connect } from 'react-redux';
import { WholeStoreState } from "~/store/store";
import { View, Animated, ViewProps } from "react-native";

interface Props {
    progress: number,
}

type GradientProgressBarProps = Props & ViewProps;

interface State {
    // Both between 0 and 1
    barOpacity: Animated.Value,
    barWidth: Animated.Value,
}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Browser/TabLocationView.swift
class GradientProgressBar extends React.Component<GradientProgressBarProps, State>{
    constructor(props: GradientProgressBarProps){
        super(props);

        this.state = {
            barWidth: new Animated.Value(props.progress),
            barOpacity: new Animated.Value(props.progress === 1 ? 0 : 1)
        };
    }

    shouldComponentUpdate(nextProps: Readonly<GradientProgressBarProps>, nextState: Readonly<State>, nextContext: any): boolean {
        if(this.props.progress !== nextProps.progress){
            if(this.props.progress === 1){
                this.state.barOpacity.stopAnimation(
                    () => {
                        Animated.timing(this.state.barOpacity, {
                            toValue: 1,
                            duration: 1000
                        })
                        .start();
                    }
                );
            }
            this.state.barWidth.stopAnimation(() => {
                Animated.timing(this.state.barWidth, {
                    toValue: this.props.progress,
                    duration: 500,
                })
                .start();
            });
        }

        return true;
    }

    render(){
        const { progress, ...rest } = this.props;

        return (
            <Animated.View
                style={{
                    flexDirection: "row",
                    // Or is it justifyContent?
                    alignItems: "flex-start",
                    width: "100%",
                    height: "auto",
                    backgroundColor: "transparent",
                    opacity: this.state.barOpacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                    }),
                }}

                // This is declared in app/components/AppContainer.scss
                // className={progress === 1 ? "fade-out-anim" : ""}
                {...rest}
            >
                <Animated.View
                    style={{
                        height: 2,
                        backgroundColor: "blue",
                        width: this.state.barWidth.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                        // opacity: progress === 1 ? 0 : 1,
                    }}
                />
            </Animated.View>
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