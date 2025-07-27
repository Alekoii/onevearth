import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/store/slices/authSlice";
import postsSlice from "@/store/slices/postsSlice";
import commentsSlice from "@/store/slices/commentsSlice";
import notificationsSlice from "@/store/slices/notificationsSlice";
import configSlice from "@/store/slices/configSlice";
import usersSlice from "@/store/slices/usersSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        posts: postsSlice,
        comments: commentsSlice,
        notifications: notificationsSlice,
        config: configSlice,
        users: usersSlice,
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
