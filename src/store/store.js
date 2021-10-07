"use strict";
exports.__esModule = true;
exports.store = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var rootReducer_1 = require("./rootReducer");
var redux_thunk_1 = require("redux-thunk");
exports.store = (0, toolkit_1.configureStore)({
    reducer: rootReducer_1.rootReducer,
    middleware: [redux_thunk_1["default"]]
});
