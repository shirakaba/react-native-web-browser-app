"use strict";
exports.__esModule = true;
exports.uiSliceReducer = exports.updateOrientation = exports.isPortrait = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var react_native_1 = require("react-native");
function isPortrait() {
    var _a = react_native_1.Dimensions.get('screen'), width = _a.width, height = _a.height;
    return height >= width;
}
exports.isPortrait = isPortrait;
;
var uiSlice = (0, toolkit_1.createSlice)({
    name: 'ui',
    initialState: {
        orientation: isPortrait() ? 'portrait' : 'landscape'
    },
    reducers: {
        updateOrientation: function (state, action) {
            state.orientation = action.payload;
        }
    }
});
exports.updateOrientation = uiSlice.actions.updateOrientation;
exports.uiSliceReducer = uiSlice.reducer;
