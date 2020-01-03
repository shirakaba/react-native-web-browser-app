import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dimensions } from "react-native";

export function isPortrait(): boolean {
    const { width, height } = Dimensions.get('screen');
    return height >= width;
};

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        orientation: isPortrait() ? 'portrait' : 'landscape',
    },
    reducers: {
        updateOrientation(state, action: PayloadAction<'portrait' | 'landscape'>) {
            state.orientation = action.payload;
        },
    }
});

export const { updateOrientation } = uiSlice.actions;
export const uiSliceReducer = uiSlice.reducer;