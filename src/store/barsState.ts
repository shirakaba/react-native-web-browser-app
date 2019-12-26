import * as React from "react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import { Action } from 'redux';
import { WholeStoreState, AppThunk } from "./store";
import { RetractionState } from "~/nativeElements/BarAwareWebView/bar-aware-web-view-interfaces";
import { select, take, put, call, fork, cancel, cancelled, delay, takeLatest } from 'redux-saga/effects';
import { View } from "tns-core-modules/ui/core/view/view";
import { Animation } from "../NativeScriptCoreUIForks/animation/animation";

export const headerBar: Record<string, React.RefObject<View>> = {
    tabLocationViewContentView: React.createRef(),
    privacyIndicator: React.createRef(),
    pageOptionsButton: React.createRef(),
};

type RetractionTarget = RetractionState.retracted|RetractionState.revealed;
type AnimatedArg = { animated: boolean };
type SetBarRetractionArgs = { retraction: RetractionTarget };
type SetBarsRetractionArgs = SetBarRetractionArgs & { bars: "header"|"footer"|"both" };

const barsSlice = createSlice({
    name: 'bars',
    initialState: {
        header: {
            retraction: RetractionState.revealed,
            percentRevealed: 100,
        },
        footer: {
            retraction: RetractionState.revealed,
            percentRevealed: 100,
        },
    },
    reducers: {
        setBarRetraction(
            state,
            action: PayloadAction<{ retraction: RetractionState } & { bar: "header"|"footer" }>
        ){
            const { retraction, bar } = action.payload;

            const barState = bar === "header" ? state.header : state.footer;

            barState.retraction = retraction;
            if(retraction === RetractionState.retracted || retraction === RetractionState.revealed){
                barState.percentRevealed = retraction === RetractionState.retracted ? 0 : 100;
            }
        },
        advanceBarRetraction(
            state,
            action: PayloadAction<{ retraction: RetractionTarget } & { bar: "header"|"footer" } & { advancePercent: number }>
        ){
            const { retraction, bar, advancePercent } = action.payload;

            const barState = bar === "header" ? state.header : state.footer;

            if(retraction === barState.retraction){
                // Already at retraction target
                return;
            }


            if(retraction === RetractionState.revealed){
                barState.percentRevealed = Math.min(100, barState.percentRevealed + advancePercent);
                // console.log(`[advanceHeaderRetraction] set barState.percentRevealed to ${barState.percentRevealed}`);
                if(barState.percentRevealed === 100){
                    barState.retraction = RetractionState.revealed;
                    // console.log(`[advanceHeaderRetraction] set barState.retraction to ${barState.retraction}`);
                }
            } else {
                barState.percentRevealed = Math.max(0, barState.percentRevealed - advancePercent);
                // console.log(`[advanceHeaderRetraction] set barState.percentRevealed to ${barState.percentRevealed}`);
                if(barState.percentRevealed === 0){
                    barState.retraction = RetractionState.retracted;
                    // console.log(`[advanceHeaderRetraction] set barState.retraction to ${barState.retraction}`);
                }
            }
        },
    }
});

export const { } = barsSlice.actions;
export const barsSliceReducer = barsSlice.reducer;

export function setBarsRetraction(args: SetBarsRetractionArgs & AnimatedArg): AppThunk {
    return function(dispatch, getState) {
        const { bars, animated, retraction } = args;
        const dispatchArgs = { animated, retraction };

        // console.log(`[setBarsRetraction]`, payload);

        // console.log(`[setBarsRetraction] with bars ${bars} and retractionTarget ${retraction}`);

        if(bars === "both"){
            return Promise.all([
                // dispatch(setHeaderRetraction(dispatchArgs)),
                dispatch({
                    type: retraction === RetractionState.retracted ? RETRACT_HEADER : REVEAL_HEADER,
                    payload: { bar: "header" }
                }),
                dispatch({
                    type: retraction === RetractionState.retracted ? RETRACT_FOOTER : REVEAL_FOOTER,
                    payload: { bar: "footer" }
                }),
            ]);
        } else {
            return dispatch({
                type: retraction === RetractionState.retracted ? 
                    (bars === "header" ? RETRACT_HEADER : RETRACT_FOOTER) : 
                    (bars === "header" ? REVEAL_HEADER : REVEAL_FOOTER),
                payload: { bar: bars }
            });
        }
    };
}

const RETRACT_HEADER = "RETRACT_HEADER" as const;
const HEADER_RETRACTED = "HEADER_RETRACTED" as const;
const HEADER_REVEALED = "HEADER_REVEALED" as const;
const REVEAL_HEADER = "REVEAL_HEADER" as const;

const RETRACT_FOOTER = "RETRACT_FOOTER" as const;
const FOOTER_RETRACTED = "FOOTER_RETRACTED" as const;
const FOOTER_REVEALED = "FOOTER_REVEALED" as const;
const REVEAL_FOOTER = "REVEAL_FOOTER" as const;

// worker Saga: will be fired on RETRACT_HEADER actions
function* advanceBarAnimation(
    type: "RETRACT_HEADER"|"REVEAL_HEADER"|"RETRACT_FOOTER"|"REVEAL_FOOTER",
    view: View,
    animationSpec: any,
) {
    const durationMs: number = 500;
    const fps: number = 60;
    const startTime: number = Date.now();
    
    let midwayActionType: RetractionState.retracting|RetractionState.revealing;
    let bar: "header"|"footer";
    let completedActionType: "HEADER_RETRACTED"|"HEADER_REVEALED"|"FOOTER_RETRACTED"|"FOOTER_REVEALED";
    let targetRetractionState: RetractionState.retracted|RetractionState.revealed;

    
    
    switch(type){
        case "RETRACT_HEADER":
            bar = "header";
            completedActionType = HEADER_RETRACTED;
            midwayActionType = RetractionState.retracting;
            targetRetractionState = RetractionState.retracted;
            break;
        case "REVEAL_HEADER":
            bar = "header";
            completedActionType = HEADER_REVEALED;
            midwayActionType = RetractionState.revealing;
            targetRetractionState = RetractionState.revealed;
            break;
        case "RETRACT_FOOTER":
            bar = "footer";
            completedActionType = FOOTER_RETRACTED;
            midwayActionType = RetractionState.retracting;
            targetRetractionState = RetractionState.retracted;
            break;
        case "REVEAL_FOOTER":
            bar = "footer";
            completedActionType = FOOTER_REVEALED;
            midwayActionType = RetractionState.revealing;
            targetRetractionState = RetractionState.revealed;
            break;
    }

    try {
        // while (true) {
            // put() means dispatch()
            yield put(barsSlice.actions.setBarRetraction({ bar, retraction: midwayActionType }));

            while (true) {
                const timePassedMs: number = Date.now() - startTime;
                const progressPercent: number = 100 * timePassedMs / durationMs;

                yield put(barsSlice.actions.advanceBarRetraction({ bar, retraction: targetRetractionState, advancePercent: progressPercent }));
                const state: WholeStoreState = yield select();
                const barState = bar === "header" ? state.bars.header : state.bars.footer;
                if(barState.retraction === targetRetractionState){
                    // console.log(`[advanceBarAnimation] targetRetractionState ${targetRetractionState}, as state was found to be ${barState.retraction}; shall action ${completedActionType}`);
                    yield put({ type: completedActionType });

                    // Goes to the line following: `yield take([HEADER_RETRACTED, REVEAL_HEADER]);`
                } else {
                    // console.log(`[advanceBarAnimation] continuing, as state was found to be`, barState.retraction);
                    yield delay(durationMs / fps);
                    // Unless an opposite-direction action interrupts, will simply continue looping around.
                }
            }
        // }
    } finally {
        /* I'm not totally sure that cancellation of the worker saga has to involve a try-catch... */
        // console.log(`[advanceBarAnimation] got into finally{} block.`);
        
        if (yield cancelled()){
            // console.log(`[advanceBarAnimation] found cancelled() was true.`);
            // yield put(actions.requestFailure('Sync cancelled!'))
            /* To my understanding, cancel(advanceBarAnimationTask) will cause an error to be thrown,
             * which will break the generator out of the while(true) loop..? */
        }
    }
}

export function* watchForHeaderRetract() {
    // console.log(`watchForHeaderRetract 1`);
    // takeLatest() seems more appropriate... And not sure about the while loop at all.
    while (true){
        const { type: requestType, payload: { view, animationSpec } } = yield take([RETRACT_HEADER, REVEAL_HEADER]);
        const oppositeType = requestType === "RETRACT_HEADER" ? REVEAL_HEADER : RETRACT_HEADER;
        const completedActionType = requestType === "RETRACT_HEADER" ? HEADER_RETRACTED : HEADER_REVEALED;
        // console.log(`watchForHeaderRetract 2`, requestType);
        // Starts the task in the background ("'fork' effects are non-blocking").
        const advanceHeaderAnimationTask = yield fork(advanceBarAnimation.bind(null, requestType, view));

        // console.log(`watchForHeaderRetract 3`);
        /* Or: https://redux-saga.js.org/docs/advanced/RacingEffects.html */
        // Wait for the animation to complete, or for the user to interrupt it
        const { type: settleType } = yield take([completedActionType, oppositeType]);
        // console.log(`watchForHeaderRetract 4 settleType ${settleType}`);
        // user clicked stop. cancel the background task
        // this will cause the forked bgSync task to jump into its finally block
        yield cancel(advanceHeaderAnimationTask);
        // Execution will reach this line only once the finally block has completed.
        // console.log(`watchForHeaderRetract 5`);

        const state: WholeStoreState = yield select();
        // console.log(`watchForHeaderRetract 6 final state ${state.bars.header.retraction}, percentRevealed ${state.bars.header.percentRevealed}`);
    }
}


export function* watchForFooterRetract() {
    // console.log(`watchForRetract 1`);
    // takeLatest() seems more appropriate... And not sure about the while loop at all.
    while (true){
        const { type: requestType, payload: { view, animationSpec } } = yield take([RETRACT_FOOTER, REVEAL_FOOTER]);
        const oppositeType = requestType === "RETRACT_FOOTER" ? REVEAL_FOOTER : RETRACT_FOOTER;
        const completedActionType = requestType === "RETRACT_FOOTER" ? FOOTER_RETRACTED : FOOTER_REVEALED;
        // console.log(`watchForRetract 2`, type);
        // Starts the task in the background ("'fork' effects are non-blocking").
        const advanceFooterAnimationTask = yield fork(advanceBarAnimation.bind(null, requestType, view));

        // console.log(`watchForRetract 3`);
        /* Or: https://redux-saga.js.org/docs/advanced/RacingEffects.html */
        // Wait for the animation to complete, or for the user to interrupt it
        yield take([completedActionType, oppositeType]);
        // console.log(`watchForRetract 4`);
        // user clicked stop. cancel the background task
        // this will cause the forked bgSync task to jump into its finally block
        yield cancel(advanceFooterAnimationTask);
        // Execution will reach this line only once the finally block has completed.
        // console.log(`watchForRetract 5`);
    }
}
