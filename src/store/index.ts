import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/store/slices/authSlice";
import configSlice from "@/store/slices/configSlice";
import usersSlice from "@/store/slices/usersSlice";

export const store = configureStore({
    reducer: {
        // Core slices only - plugins register their own slices dynamically
        auth: authSlice,
        config: configSlice,
        users: usersSlice,
        // Plugin slices (posts, comments, notifications) are registered dynamically
        // by the PluginManager when plugins are loaded
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
