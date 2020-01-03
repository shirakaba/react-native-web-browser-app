# React Native Web Browser App

An open-source, extensible cross-platform (mobile and desktop) web browser made in React Native!

## Motivation

My masochistic hobby project is building a web browser for browsing foreign-language websites: [LinguaBrowse iOS](https://apps.apple.com/us/app/linguabrowse/id1281350165?ls=1). It is a basic minimal clone of iOS Safari that does a lot of Natural Language Processing and JS injection, manages a vocabulary list, and handles In-App Purchases. It was written imperatively in Swift, which ultimately brought my productivity to a standstill, as I found UIs much harder to build in UIKit than in React, and state much harder to manage in an imperative coding style.

Last year I tried to address these issues [by porting LinguaBrowse to React Native macOS](https://apps.apple.com/us/app/linguabrowse/id1422884180), but ultimately gave up developing it due to the premature state of React Native macOS: I was unable to code-share with iOS; had to make most of the UI on the native side (with lots of message-passing over the bridge) due to incomplete React components; and hot-reloading didn't work. But it was fun and showed great promise.

So here I am foolishly building the same browser for the third time, and this time the landscape of React Native and cross-platform app development is looking more exciting than ever:

* React Native has Fast Refresh and auto-linking;
* Apple have produced Catalyst (meaning that I don't have to use React Native macOS);
* Microsoft are driving desktop platforms on React Native (meaning that a new React Native macOS is available anyway);
* JSI and turbo-modules are on its way;
* Redux Toolkit makes Redux bearable with TypeScript, and;
* Expo are doing great work driving the ecosystem with Unimodules, React Navigation, and more.

Given all this momentum behind React Native, I believe that we now have the maturity of tools to pull off a cross-platform, declarative UI-based web browser in a single code-base. So rather than attempt it all on my own and couple the code to LinguaBrowse, I've decided to open-source the 'browser' aspect of LinguaBrowse and maintain any of my brand-specific stuff in a separate fork. In fact, with adequate extension APIs, a fork may not even be needed at all.

## Scope

The browser should:

* have a UI that is no less functional than that of Firefox's; 
* support at least iOS, Android, macOS, and Windows from one codebase;
* allow consumers to swap out the WebView for another one (for now, I'm using my fork of `react-native-webview`);

To be clear: This project is **purely** focused on building a browser UI, and forwarding user actions to a WebView. We are not trying to rebuild a browser engine here – just the UI around it.

## Roadmap

- [X] Functional navigation buttons (back, forward, stop, refresh)
- [X] Functional URL bar (can navigate to URL inputs and updates text upon page redirect)
- [X] Rotation
- [X] Bar retraction
- [X] Intelligent URL vs. search query determination in search bar
- [ ] Search suggestions
- [ ] Bars snapping to fully retracted/revealed upon gesture release
- [ ] Tabs
- [ ] History
- [ ] Browsing-state persistence
- [ ] Bookmarks
- [ ] Reading list
- [ ] Page-specific actions
- [ ] Branded app-specific actions (e.g. JS injection, popup blocking, whatever)

## Prior art

I have been talking a fair bit about browser-building with the Cliqz team, as they are doing some exciting work (see these stellar [blog posts](https://www.0x65.dev)) in this space right now.

Cliqz provides superb prior art – it would be great (in my opinion) if this project could converge with it in some way to provide a single, declarative UI codebase that could be used for all platforms. They already use a cross-platform core. In fact, they have experimented with a React Native UI at least for the purposes of producing a Windows app, and I shall have to ask what brought that experiment to an end. It could be that this project could feed into `cliqz-s` (see below), or vice-versa.

Cliqz give [good reasons](https://www.0x65.dev/blog/2019-12-17/why-we-forked-firefox-and-not-chromium.html) as to why they use Firefox as a basis rather than Chromium.

* [`cliqz-oss/browser-android`](https://github.com/cliqz-oss/browser-android): an Android web browser UI built in Java, based on Firefox for Android(?). Is the UI for the Cliqz Play Store Android app.
* [`cliqz/user-agent-ios`](https://github.com/cliqz/user-agent-ios): an iOS web browser UI built in Swift, based on Firefox for iOS. [Is the UI for the Cliqz AppStore iOS app](https://twitter.com/chrmod/status/1204771688824655872?s=20).
* [`cliqz-oss/cliqz-s`](https://github.com/cliqz-oss/cliqz-s): Cliqz's prototype Windows browser, written in React Native Windows ([not meant for production](https://twitter.com/chrmod/status/1204772242279809025?s=20)).
* [`cliqz-oss/browser-f`](https://github.com/cliqz-oss/browser-f): Cliqz's production desktop browser (Windows & Mac), based on Firefox desktop. There are a mixture of languages in the source: C++ and JS, at least. I'm not really sure what the dominant UI language is.
* [`cliqz-oss/browser-core`](https://github.com/cliqz-oss/browser-core): Cliqz's set of cross-platform (desktop & mobile) core modules such as their search UI.
* [Mozilla Application Services](https://github.com/mozilla/application-services/blob/master/README.md), recommended as a state storage solution by [Krzysztof Modras](https://twitter.com/chrmod/status/1208335429507960832?s=20) of Cliqz – particularly Places DB (explained by Krzysztof [here](https://twitter.com/chrmod/status/1208336158037557248?s=20)).

