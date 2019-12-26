/**
 * Copyright (c) 2016-present, Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { processColor } from "react-native";

/**
 * Copied from isWebColor:
 * @see https://github.com/necolas/react-native-web/blob/ff5a928a5067859b289098cd6a8853b635841805/packages/react-native-web/src/modules/isWebColor/index.js
 * @param color a color that can be processed by processColor().
 */
const isWebColor = (color: string): boolean =>
  color === 'currentcolor' ||
  color === 'currentColor' ||
  color === 'inherit' ||
  color.indexOf('var(') === 0;

export interface ColorObj {
    // 0 to 255
    r: number,
    g: number,
    b: number,

    // 0 (transparent) to 1 (opaque)
    a: number,
}

/**
 * Written with reference to normalizeColor:
 * @see https://github.com/necolas/react-native-web/blob/ff5a928a5067859b289098cd6a8853b635841805/packages/react-native-web/src/modules/normalizeColor/index.js
 * @param color a color that can be processed by processColor()
 * @param opacity number between 0 (transparent) and 1 (opaque).
 */
function normalizeColorToObj(color: number | string, opacity: number = 1): ColorObj {
    if (typeof color === 'string' && isWebColor(color)) {
        throw new Error(`React Native does not support web-only colors.`);
    }

    const colorInt = processColor(color);
    if (colorInt != null) {
        // 0 to 255
        const r = (colorInt >> 16) & 255;
        const g = (colorInt >> 8) & 255;
        const b = colorInt & 255;

        // 0 to 1
        const a = ((colorInt >> 24) & 255) / 255;
        return {
            r, g, b, a
        };
    }
};

export default normalizeColorToObj;