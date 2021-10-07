"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
exports.__esModule = true;
exports.stopWebView = exports.reloadWebView = exports.goForwardOnWebView = exports.goBackOnWebView = exports.submitUrlBarTextToWebView = exports.getWebView = exports.navigationSliceReducer = exports.updateWebViewNavigationState = exports.setProgressOnWebView = exports.updateUrlBarText = exports.webViews = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var React = require("react");
var urlBarTextHandling_1 = require("../utils/urlBarTextHandling");
exports.webViews = new Map([
    ["tab0", React.createRef()]
]);
var initialPage = "https://www.birchlabs.co.uk";
var navigationSlice = (0, toolkit_1.createSlice)({
    name: 'navigation',
    initialState: {
        activeTab: "tab0",
        tabs: {
            tab0: {
                url: initialPage,
                isSecure: true,
                loadProgress: 0,
                canGoBack: false,
                canGoForward: false
            }
        },
        urlBarText: initialPage,
        searchProvider: urlBarTextHandling_1.SearchProvider.DuckDuckGo
    },
    reducers: {
        /**
         * Update the singleton URL bar's displayed text (does not launch a query).
         */
        updateUrlBarText: function (state, action) {
            // console.log(`[navigationState.ts] updateUrlBarText action ${JSON.stringify(action)} and state`, state);
            var _a = action.payload, text = _a.text, fromNavigationEvent = _a.fromNavigationEvent;
            state.urlBarText = text;
            if (fromNavigationEvent) {
                state.tabs[state.activeTab].isSecure = text.startsWith("https://") ? true : text.startsWith("http://") ? false : null;
            }
        },
        updateWebViewNavigationState: function (state, action) {
            var _a = action.payload, canGoBack = _a.canGoBack, canGoForward = _a.canGoForward, _b = _a.tab, tab = _b === void 0 ? state.activeTab : _b;
            state.tabs[tab] = __assign(__assign({}, state.tabs[tab]), { canGoBack: canGoBack, canGoForward: canGoForward });
        },
        setUrlOnWebView: function (state, action) {
            // console.log(`[setUrlOnWebView] setting url for activeTab "${state.activeTab}" as: "${action.payload.url}"`);
            var _a = action.payload, url = _a.url, _b = _a.tab, tab = _b === void 0 ? state.activeTab : _b;
            state.tabs[tab] = __assign(__assign({}, state.tabs[tab]), { url: url, isSecure: url.startsWith("https://") ? true : url.startsWith("http://") ? false : null, loadProgress: 0 });
        },
        setProgressOnWebView: function (state, action) {
            // console.log(`[setUrlOnWebView] setting progress for activeTab "${state.activeTab}" as: "${action.payload.progress}"`);
            var _a = action.payload, progress = _a.progress, _b = _a.tab, tab = _b === void 0 ? state.activeTab : _b;
            state.tabs[tab].loadProgress = progress;
        },
        goBackOnWebView: function (state, action) {
        },
        goForwardOnWebView: function (state, action) {
        },
        reloadWebView: function (state, action) {
        },
        stopWebView: function (state, action) {
        }
    }
});
exports.updateUrlBarText = (_a = navigationSlice.actions, _a.updateUrlBarText), exports.setProgressOnWebView = _a.setProgressOnWebView, exports.updateWebViewNavigationState = _a.updateWebViewNavigationState;
exports.navigationSliceReducer = navigationSlice.reducer;
function getWebView(tab) {
    var webViewRef = exports.webViews.get(tab);
    if (!webViewRef) {
        console.error("Unable to find webViewRef for tab \"" + tab + "\".");
        return null;
    }
    if (!webViewRef.current) {
        console.error("webViewRef for tab \"" + tab + "\" wasn't populated.");
        return null;
    }
    if (webViewRef.current.getNode) {
        console.log("webViewRef for tab \"" + tab + "\" is an Reanimated component; calling getNode() on it.");
        return webViewRef.current.getNode();
    }
    return webViewRef.current;
}
exports.getWebView = getWebView;
function submitUrlBarTextToWebView(text, tab) {
    return function (dispatch, getState) {
        var chosenTab = tab || getState().navigation.activeTab;
        var webView = getWebView(chosenTab);
        if (!webView) {
            return Promise.resolve();
        }
        var trimmedText = text.trim();
        if (trimmedText.length === 0) {
            return Promise.resolve();
        }
        var url;
        var protocol = null;
        if (trimmedText.startsWith("//")) {
            // We won't support protocol-relative URLs.
            // TODO: reject
            return Promise.resolve();
        }
        // https://stackoverflow.com/questions/2824302/how-to-make-regular-expression-into-non-greedy
        var protocolMatchArr = trimmedText.match(/.*?:\/\//);
        var lacksWhitespace = !/\s+/.test(trimmedText); // This is a cheap test, so we do it in preference of isValidUrl().
        if (protocolMatchArr === null ||
            protocolMatchArr.length === 0 ||
            trimmedText.indexOf(protocolMatchArr[0]) !== 0) {
            /* No protocol at start of string. Possible Cases:
             * "bbc.co.uk", "foo bar", "what does https:// mean?", "bbc.co.uk#https://" (Safari fails this one as invalid) */
            if (lacksWhitespace && (0, urlBarTextHandling_1.isValidUrl)(trimmedText)) {
                protocol = "http"; // It's now the server's responsibility to redirect us to HTTPS if available.
                url = protocol + "://" + trimmedText;
            }
            else {
                protocol = "https"; // All our search engines use HTTPS
                url = (0, urlBarTextHandling_1.convertTextToSearchQuery)(trimmedText, getState().navigation.searchProvider);
            }
        }
        else {
            // Has a protocol at start ("https://bbc.co.uk").
            protocol = protocolMatchArr[0].slice(0, -("://".length));
            url = trimmedText;
        }
        if (protocol === "file") {
            // We won't support file browsing (can rethink this later).
            // TODO: reject
            return Promise.resolve();
        }
        if (webView.src === url) {
            console.log("[setUrlOnWebView] Setting URL on webView for chosenTab \"" + chosenTab + "\" as same as before, so reloading: " + url);
            webView.reload();
        }
        else {
            console.log("[setUrlOnWebView] Setting URL on webView for chosenTab \"" + chosenTab + "\" as: " + url);
            webView.src = url;
        }
        console.log("[setUrlOnWebView] Dispatching action to set url for chosenTab \"" + chosenTab + "\" as: \"" + url + "\"");
        return dispatch(navigationSlice.actions.setUrlOnWebView({ url: url, canGoBack: webView.canGoBack, canGoForward: webView.canGoForward, tab: chosenTab }));
    };
}
exports.submitUrlBarTextToWebView = submitUrlBarTextToWebView;
function goBackOnWebView(tab) {
    return function (dispatch, getState) {
        var chosenTab = tab || getState().navigation.activeTab;
        var webView = getWebView(chosenTab);
        if (!webView) {
            return Promise.resolve();
        }
        console.log("[goBackOnWebView] Calling goBack() on webView for chosenTab \"" + chosenTab + "\" while canGoBack is: " + webView.canGoBack);
        webView.goBack();
        return dispatch(navigationSlice.actions.goBackOnWebView());
    };
}
exports.goBackOnWebView = goBackOnWebView;
function goForwardOnWebView(tab) {
    return function (dispatch, getState) {
        var chosenTab = tab || getState().navigation.activeTab;
        var webView = getWebView(chosenTab);
        if (!webView) {
            return Promise.resolve();
        }
        console.log("[goForwardOnWebView] Calling goForward() on webView for chosenTab \"" + chosenTab + "\" while canGoForward is: " + webView.canGoForward);
        webView.goForward();
        return dispatch(navigationSlice.actions.goForwardOnWebView());
    };
}
exports.goForwardOnWebView = goForwardOnWebView;
function reloadWebView(tab) {
    return function (dispatch, getState) {
        var chosenTab = tab || getState().navigation.activeTab;
        var webView = getWebView(chosenTab);
        if (!webView) {
            return Promise.resolve();
        }
        console.log("[goBackOnWebView] Calling reload() on webView for chosenTab \"" + chosenTab + "\".");
        webView.reload();
        return dispatch(navigationSlice.actions.reloadWebView());
    };
}
exports.reloadWebView = reloadWebView;
function stopWebView(tab) {
    return function (dispatch, getState) {
        var chosenTab = tab || getState().navigation.activeTab;
        var webView = getWebView(chosenTab);
        if (!webView) {
            return Promise.resolve();
        }
        console.log("[stopWebView] Calling reload() on webView for chosenTab \"" + chosenTab + "\".");
        webView.stopLoading();
        return dispatch(navigationSlice.actions.stopWebView());
    };
}
exports.stopWebView = stopWebView;
