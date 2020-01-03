import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, RootReducer } from "./rootReducer";
import thunk, { ThunkAction } from "redux-thunk";
import { Action } from 'redux';

export const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk],
});

export type WholeStoreState = RootReducer;
// https://redux.js.org/recipes/usage-with-typescript/#usage-with-redux-thunk
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    WholeStoreState,
    null,
    Action<string>
>;