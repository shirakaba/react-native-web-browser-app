import { combineReducers } from "@reduxjs/toolkit";
import { navigationSliceReducer } from "./navigationState";
import { uiSliceReducer } from "./uiState";

export const rootReducer = combineReducers({
    ui: uiSliceReducer,
    navigation: navigationSliceReducer,
});

export type RootReducer = ReturnType<typeof rootReducer>;