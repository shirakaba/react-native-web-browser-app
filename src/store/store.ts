import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { rootReducer, RootReducer } from "./rootReducer";
import thunk, { ThunkAction } from "redux-thunk";
import { Action } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { watchForHeaderRetract, watchForFooterRetract } from "./barsState";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk, sagaMiddleware],
});

sagaMiddleware.run(watchForHeaderRetract);
sagaMiddleware.run(watchForFooterRetract);

export type WholeStoreState = RootReducer;
// https://redux.js.org/recipes/usage-with-typescript/#usage-with-redux-thunk
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    WholeStoreState,
    null,
    Action<string>
>;