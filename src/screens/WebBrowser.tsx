import React from 'react';
import {BrowserConfig, defaultConfig} from '../browser/browserConfig.tsx';

export default function WebBrowser() {
  return (
    <>
      {barAwareWebView({
        headerConfig: defaultConfig.header,
        scrollY: scrollY,
        scrollEndDragVelocity: scrollEndDragVelocity,
      })}
    </>
  );
}
