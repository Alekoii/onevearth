import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppConfig } from "@/core/config/types";

interface ConfigState {
    config: AppConfig | null;
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
}

const initialState: ConfigState = {
    config: null,
    loading: false,
    error: null,
    lastUpdated: null,
};

const configSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setConfig: (state, action: PayloadAction<AppConfig>) => {
            state.config = action.payload;
            state.lastUpdated = new Date().toISOString();
        },
        updateConfig: (state, action: PayloadAction<Partial<AppConfig>>) => {
            if (state.config) {
                state.config = { ...state.config, ...action.payload };
                state.lastUpdated = new Date().toISOString();
            }
        },
        clearConfig: (state) => {
            state.config = null;
            state.lastUpdated = null;
        },
    },
});

export const {
    setLoading,
    setError,
    setConfig,
    updateConfig,
    clearConfig,
} = configSlice.actions;

export default configSlice.reducer;
