import * as React from "react";
import { TextInput } from "react-native";

interface Props {

}

interface State {

}

// https://github.com/cliqz/user-agent-ios/blob/develop/Client/Frontend/Widgets/AutocompleteTextField.swift
export class AutocompleteTextField extends React.Component<Props, State>{
    render(){
        return (
            <TextInput/>
        );
    }
}