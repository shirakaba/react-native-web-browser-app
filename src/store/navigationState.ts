import * as React from "react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import { Action } from 'redux';
import { WholeStoreState, AppThunk } from "./store";

type WebView = any;
type WebViewId = string;
export const webViews = new Map<WebViewId, React.RefObject<WebView>>([
    ["tab0", React.createRef<WebView>()]
]);
export type TabStateRecord = Record<string, { url: string, loadProgress: number }>;


const initialPage: string = "https://www.birchlabs.co.uk";

const navigationSlice = createSlice({
    name: 'navigation',
    initialState: {
        activeTab: "tab0",
        tabs: {
            tab0: {
                url: initialPage,
                loadProgress: 0,
            }
        },
        urlBarText: initialPage
    },
    reducers: {
        /**
         * Update the singleton URL bar's displayed text (does not launch a query).
         */
        updateUrlBarText(state, action: PayloadAction<string>) {
            // console.log(`[navigationState.ts] updateUrlBarText action ${JSON.stringify(action)} and state`, state);
            const text = action.payload;
            state.urlBarText = text;
        },
        setUrlOnWebView(state, action: PayloadAction<{ url: string, tab?: string }>) {
            // console.log(`[setUrlOnWebView] setting url for activeTab "${state.activeTab}" as: "${action.payload.url}"`);
            const { url, tab = state.activeTab } = action.payload;
            state.tabs[tab] = {
                url,
                loadProgress: 0,
            };
        },
        setProgressOnWebView(state, action: PayloadAction<{ progress: number, tab?: string }>) {
            // console.log(`[setUrlOnWebView] setting progress for activeTab "${state.activeTab}" as: "${action.payload.progress}"`);
            const { progress, tab = state.activeTab } = action.payload;
            state.tabs[tab].loadProgress = progress;
        },
        goBackOnWebView(state, action: PayloadAction<void>){

        },
        goForwardOnWebView(state, action: PayloadAction<void>){

        },
        reloadWebView(state, action: PayloadAction<void>){

        },
        stopWebView(state, action: PayloadAction<void>){

        },
    }
});

export const { updateUrlBarText, setProgressOnWebView } = navigationSlice.actions;
export const navigationSliceReducer = navigationSlice.reducer;

function getWebView(tab: string){
    const webViewRef = webViews.get(tab);
    if(!webViewRef){
        console.error(`Unable to find webViewRef for tab "${tab}".`);
        return null;
    }
    if(!webViewRef.current){
        console.error(`webViewRef for tab "${tab}" wasn't populated.`);
        return null;
    }

    return webViewRef.current!;
}

export function submitUrlBarTextToWebView(url: string, tab?: string): AppThunk {
    return function(dispatch, getState) {
        const chosenTab: string = tab || getState().navigation.activeTab;
        const webView = getWebView(chosenTab);
        if(!webView){
            return Promise.resolve();
        }

        console.log(`[setUrlOnWebView] Setting URL on webView for chosenTab "${chosenTab}" as: ${url}`);
        webView.src = url;

        console.log(`[setUrlOnWebView] Dispatching action to set url for chosenTab "${chosenTab}" as: "${url}"`);
        return dispatch(navigationSlice.actions.setUrlOnWebView({ url, tab: chosenTab }));
    };
}

export function goBackOnWebView(tab?: string): AppThunk {
    return function(dispatch, getState) {
        const chosenTab: string = tab || getState().navigation.activeTab;
        const webView = getWebView(chosenTab);
        if(!webView){
            return Promise.resolve();
        }

        console.log(`[goBackOnWebView] Calling goBack() on webView for chosenTab "${chosenTab}" while canGoBack is: ${webView.canGoBack}`);
        webView.goBack();

        return dispatch(navigationSlice.actions.goBackOnWebView());
    };
}

export function goForwardOnWebView(tab?: string): AppThunk {
    return function(dispatch, getState) {
        const chosenTab: string = tab || getState().navigation.activeTab;
        const webView = getWebView(chosenTab);
        if(!webView){
            return Promise.resolve();
        }

        console.log(`[goForwardOnWebView] Calling goForward() on webView for chosenTab "${chosenTab}" while canGoForward is: ${webView.canGoForward}`);
        webView.goForward();

        return dispatch(navigationSlice.actions.goForwardOnWebView());
    };
}


export function reloadWebView(tab?: string): AppThunk {
    return function(dispatch, getState) {
        const chosenTab: string = tab || getState().navigation.activeTab;
        const webView = getWebView(chosenTab);
        if(!webView){
            return Promise.resolve();
        }

        console.log(`[goBackOnWebView] Calling refresh() on webView for chosenTab "${chosenTab}".`);
        webView.reload();

        return dispatch(navigationSlice.actions.reloadWebView());
    };
}

export function stopWebView(tab?: string): AppThunk {
    return function(dispatch, getState) {
        const chosenTab: string = tab || getState().navigation.activeTab;
        const webView = getWebView(chosenTab);
        if(!webView){
            return Promise.resolve();
        }

        console.log(`[stopWebView] Calling refresh() on webView for chosenTab "${chosenTab}".`);
        webView.stopLoading();

        return dispatch(navigationSlice.actions.stopWebView());
    };
}
