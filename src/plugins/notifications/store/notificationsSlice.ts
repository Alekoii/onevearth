import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationService } from "../services/NotificationService";
import { Notification, NotificationsState } from "../types";

const initialState: NotificationsState = {
    items: [],
    loading: false,
    refreshing: false,
    loadingMore: false,
    error: null,
    paginationError: null,
    hasMore: true,
    nextCursor: null,
    unreadCount: 0,
    lastRefresh: null,
};

export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async (
        { userId, refresh = false }: { userId: string; refresh?: boolean },
    ) => {
        if (refresh) {
            const result = await NotificationService.getNotifications(userId);
            const unreadCount = await NotificationService.getUnreadCount(
                userId,
            );
            return { ...result, unreadCount };
        }

        const result = await NotificationService.getNotifications(userId);
        return result;
    },
);

export const loadMoreNotifications = createAsyncThunk(
    "notifications/loadMoreNotifications",
    async ({ userId, cursor }: { userId: string; cursor: string }) => {
        return await NotificationService.getNotifications(userId, cursor);
    },
);

export const fetchUnreadCount = createAsyncThunk(
    "notifications/fetchUnreadCount",
    async (userId: string) => {
        return await NotificationService.getUnreadCount(userId);
    },
);

export const markNotificationAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (notificationId: number) => {
        await NotificationService.markAsRead(notificationId);
        return notificationId;
    },
);

export const markAllNotificationsAsRead = createAsyncThunk(
    "notifications/markAllAsRead",
    async (userId: string) => {
        await NotificationService.markAllAsRead(userId);
        return userId;
    },
);

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.paginationError = null;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.items.unshift(action.payload);
            if (!action.payload.read) {
                state.unreadCount += 1;
            }
        },
        updateUnreadCount: (state, action: PayloadAction<number>) => {
            state.unreadCount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state, action) => {
                if (action.meta.arg.refresh) {
                    state.refreshing = true;
                } else {
                    state.loading = true;
                }
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.refreshing = false;
                state.items = action.payload.data;
                state.hasMore = action.payload.hasMore;
                state.nextCursor = action.payload.nextCursor;
                state.lastRefresh = Date.now();
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.refreshing = false;
                state.error = action.error.message ||
                    "Failed to fetch notifications";
            })
            .addCase(loadMoreNotifications.pending, (state) => {
                state.loadingMore = true;
                state.paginationError = null;
            })
            .addCase(loadMoreNotifications.fulfilled, (state, action) => {
                state.loadingMore = false;
                state.items.push(...action.payload.data);
                state.hasMore = action.payload.hasMore;
                state.nextCursor = action.payload.nextCursor;
            })
            .addCase(loadMoreNotifications.rejected, (state, action) => {
                state.loadingMore = false;
                state.paginationError = action.error.message ||
                    "Failed to load more";
            })
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notification = state.items.find((n) =>
                    n.id === action.payload
                );
                if (notification && !notification.read) {
                    notification.read = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.items.forEach((notification) => {
                    notification.read = true;
                });
                state.unreadCount = 0;
            });
    },
});

export const { clearError, addNotification, updateUnreadCount } =
    notificationsSlice.actions;
export default notificationsSlice.reducer;
