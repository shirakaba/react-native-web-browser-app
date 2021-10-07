"use strict";
exports.__esModule = true;
exports.rootReducer = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var navigationState_1 = require("./navigationState");
var uiState_1 = require("./uiState");
exports.rootReducer = (0, toolkit_1.combineReducers)({
    ui: uiState_1.uiSliceReducer,
    navigation: navigationState_1.navigationSliceReducer
});
