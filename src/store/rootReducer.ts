import { combineReducers } from "@reduxjs/toolkit";
import { navigationSliceReducer } from "./navigationState";
import { barsSliceReducer } from "./barsState";
import { uiSliceReducer } from "./uiState";

export const rootReducer = combineReducers({
    ui: uiSliceReducer,
    navigation: navigationSliceReducer,
    bars: barsSliceReducer,
});

export type RootReducer = ReturnType<typeof rootReducer>;