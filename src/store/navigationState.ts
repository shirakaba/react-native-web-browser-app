import * as React from "react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import { Action } from 'redux';
import { WholeStoreState, AppThunk } from "./store";
import { isValidUrl, convertTextToSearchQuery, SearchProvider } from "~/utils/urlBarTextHandling";

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
                isSecure: true,
                loadProgress: 0,
                canGoBack: false,
                canGoForward: false,
            }
        },
        urlBarText: initialPage,
        searchProvider: SearchProvider.DuckDuckGo,
    },
    reducers: {
        /**
         * Update the singleton URL bar's displayed text (does not launch a query).
         */
        updateUrlBarText(state, action: PayloadAction<{ text: string, fromNavigationEvent: boolean }>) {
            console.log(`[navigationState.ts] updateUrlBarText action ${JSON.stringify(action)} and state`, state);
            const { text, fromNavigationEvent } = action.payload;
            state.urlBarText = text;
            if(fromNavigationEvent){
                state.tabs[state.activeTab].isSecure = text.startsWith("https://") ? true : text.startsWith("http://") ? false : null;
            }
        },
        updateWebViewNavigationState(state, action: PayloadAction<{ canGoBack: boolean, canGoForward: boolean, tab?: string }>){
            const { canGoBack, canGoForward, tab = state.activeTab } = action.payload;
            state.tabs[tab] = {
                ...state.tabs[tab],
                canGoBack,
                canGoForward,
            };
        },
        setUrlOnWebView(state, action: PayloadAction<{ url: string, tab?: string }>) {
            // console.log(`[setUrlOnWebView] setting url for activeTab "${state.activeTab}" as: "${action.payload.url}"`);
            const { url, tab = state.activeTab } = action.payload;
            state.tabs[tab] = {
                ...state.tabs[tab],
                url,
                isSecure: url.startsWith("https://") ? true : url.startsWith("http://") ? false : null,
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

export const { updateUrlBarText, setProgressOnWebView, updateWebViewNavigationState } = navigationSlice.actions;
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

    if((webViewRef.current as any).getNode){
        console.log(`webViewRef for tab "${tab}" is an Reanimated component; calling getNode() on it.`);
        return (webViewRef.current as any).getNode();
    }

    return webViewRef.current!;
}

export function submitUrlBarTextToWebView(text: string, tab?: string): AppThunk {
    return function(dispatch, getState) {
        const chosenTab: string = tab || getState().navigation.activeTab;
        const webView = getWebView(chosenTab);
        if(!webView){
            return Promise.resolve();
        }

        const trimmedText: string = text.trim();

        if(trimmedText.length === 0){
            return Promise.resolve();
        }

        let url: string;
        let protocol: string|null = null;

        if(trimmedText.startsWith("//")){
            // We won't support protocol-relative URLs.
            // TODO: reject
            return Promise.resolve();
        }

        // https://stackoverflow.com/questions/2824302/how-to-make-regular-expression-into-non-greedy
        const protocolMatchArr: RegExpMatchArray|null = trimmedText.match(/.*?:\/\//);
        const lacksWhitespace: boolean = !/\s+/.test(trimmedText); // This is a cheap test, so we do it in preference of isValidUrl().
        if(
            protocolMatchArr === null || 
            protocolMatchArr.length === 0 || 
            trimmedText.indexOf(protocolMatchArr[0]) !== 0
        ){
            /* No protocol at start of string. Possible Cases:
             * "bbc.co.uk", "foo bar", "what does https:// mean?", "bbc.co.uk#https://" (Safari fails this one as invalid) */
            if(lacksWhitespace && isValidUrl(trimmedText)){
                protocol = "http"; // It's now the server's responsibility to redirect us to HTTPS if available.
                url = `${protocol}://${trimmedText}`;
            } else {
                protocol = "https"; // All our search engines use HTTPS
                url = convertTextToSearchQuery(
                    trimmedText,
                    getState().navigation.searchProvider,
                );
            }
        } else {
            // Has a protocol at start ("https://bbc.co.uk").
            protocol = protocolMatchArr[0].slice(0, -("://".length));
            url = trimmedText;
        }

        if(protocol === "file"){
            // We won't support file browsing (can rethink this later).
            // TODO: reject
            return Promise.resolve();
        }

        if(webView.src === url){
            console.log(`[setUrlOnWebView] Setting URL on webView for chosenTab "${chosenTab}" as same as before, so refreshing: ${url}`);
            webView.refresh();
        } else {
            console.log(`[setUrlOnWebView] Setting URL on webView for chosenTab "${chosenTab}" as: ${url}`);
            webView.src = url;
        }

        console.log(`[setUrlOnWebView] Dispatching action to set url for chosenTab "${chosenTab}" as: "${url}"`);

        return dispatch(navigationSlice.actions.setUrlOnWebView({ url, canGoBack: webView.canGoBack, canGoForward: webView.canGoForward, tab: chosenTab }));
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
