import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppConfig } from "@/core/config/types";
import { ConfigManager } from "@/core/config/ConfigManager";

interface ConfigState {
    config: AppConfig;
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
    isInitialized: boolean;
}

const initialState: ConfigState = {
    config: ConfigManager.getDefault(),
    loading: false,
    error: null,
    lastUpdated: null,
    isInitialized: false,
};

// Async thunk for loading configuration
export const loadConfig = createAsyncThunk(
    "config/load",
    async (_, { rejectWithValue }) => {
        try {
            const config = await ConfigManager.load();
            return config;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

// Async thunk for saving local overrides
export const saveLocalOverride = createAsyncThunk(
    "config/saveLocalOverride",
    async (
        { path, value }: { path: string; value: any },
        { rejectWithValue },
    ) => {
        try {
            await ConfigManager.saveLocalOverride(path, value);
            // Reload configuration after saving
            const config = await ConfigManager.load();
            return config;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

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
            state.isInitialized = true;
            state.error = null;
        },

        updateConfigLocal: (
            state,
            action: PayloadAction<Partial<AppConfig>>,
        ) => {
            // Only allow updates to user preferences, not core configuration
            const allowedUpdates: Partial<AppConfig> = {};

            // Allow theme updates
            if (action.payload.ui?.theme) {
                allowedUpdates.ui = {
                    ...state.config.ui,
                    theme: action.payload.ui.theme,
                };
            }

            // Allow accessibility updates
            if (action.payload.ui?.accessibility) {
                allowedUpdates.ui = {
                    ...allowedUpdates.ui || state.config.ui,
                    accessibility: action.payload.ui.accessibility,
                };
            }

            // Apply allowed updates
            if (Object.keys(allowedUpdates).length > 0) {
                state.config = deepMerge(state.config, allowedUpdates);
                state.lastUpdated = new Date().toISOString();
            }
        },

        resetToDefaults: (state) => {
            state.config = ConfigManager.getDefault();
            state.lastUpdated = new Date().toISOString();
            state.error = null;
        },

        clearLocalOverrides: (state) => {
            // This will trigger a reload with default config
            ConfigManager.clearLocalOverrides();
            state.config = ConfigManager.getDefault();
            state.lastUpdated = new Date().toISOString();
        },
    },

    extraReducers: (builder) => {
        // Load config
        builder
            .addCase(loadConfig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadConfig.fulfilled, (state, action) => {
                state.loading = false;
                state.config = action.payload;
                state.lastUpdated = new Date().toISOString();
                state.isInitialized = true;
                state.error = null;
            })
            .addCase(loadConfig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                // Set default config on error
                state.config = ConfigManager.getDefault();
                state.isInitialized = true;
            });

        // Save local override
        builder
            .addCase(saveLocalOverride.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveLocalOverride.fulfilled, (state, action) => {
                state.loading = false;
                state.config = action.payload;
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(saveLocalOverride.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setLoading,
    setError,
    setConfig,
    updateConfigLocal,
    resetToDefaults,
    clearLocalOverrides,
} = configSlice.actions;

export default configSlice.reducer;

// Selectors
export const selectConfig = (state: { config: ConfigState }) =>
    state.config.config;
export const selectConfigLoading = (state: { config: ConfigState }) =>
    state.config.loading;
export const selectConfigError = (state: { config: ConfigState }) =>
    state.config.error;
export const selectIsConfigInitialized = (state: { config: ConfigState }) =>
    state.config.isInitialized;

export const selectIsFeatureEnabled =
    (feature: string) => (state: { config: ConfigState }) => {
        return ConfigManager.isFeatureEnabled(state.config.config, feature);
    };

export const selectPluginConfig =
    (pluginId: string) => (state: { config: ConfigState }) => {
        return ConfigManager.getPluginConfig(state.config.config, pluginId);
    };

export const selectIsPluginEnabled =
    (pluginId: string) => (state: { config: ConfigState }) => {
        return ConfigManager.isPluginEnabled(state.config.config, pluginId);
    };

// Helper function for deep merging
function deepMerge(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
        if (
            source[key] && typeof source[key] === "object" &&
            !Array.isArray(source[key])
        ) {
            result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }

    return result;
}
