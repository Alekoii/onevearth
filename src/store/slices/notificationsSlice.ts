import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
    id: string;
    recipientId: string;
    actorId: string;
    type: "new_reaction" | "new_comment" | "new_mention" | "new_follower";
    read: boolean;
    postId?: string;
    commentId?: string;
    createdAt: string;
}

interface NotificationsState {
    items: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationsState = {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setNotifications: (state, action: PayloadAction<Notification[]>) => {
            state.items = action.payload;
            state.unreadCount = action.payload.filter((n) => !n.read).length;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.items.unshift(action.payload);
            if (!action.payload.read) {
                state.unreadCount += 1;
            }
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.items.find((n) =>
                n.id === action.payload
            );
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadCount -= 1;
            }
        },
        markAllAsRead: (state) => {
            state.items.forEach((n) => n.read = true);
            state.unreadCount = 0;
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            const notification = state.items.find((n) =>
                n.id === action.payload
            );
            if (notification && !notification.read) {
                state.unreadCount -= 1;
            }
            state.items = state.items.filter((n) => n.id !== action.payload);
        },
    },
});

export const {
    setLoading,
    setError,
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
