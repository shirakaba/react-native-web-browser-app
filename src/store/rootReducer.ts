import { combineReducers } from "@reduxjs/toolkit";
import { navigationSliceReducer } from "./navigationState";
import { barsSliceReducer } from "./barsState";

export const rootReducer = combineReducers({
    navigation: navigationSliceReducer,
    bars: barsSliceReducer,
});

export type RootReducer = ReturnType<typeof rootReducer>;