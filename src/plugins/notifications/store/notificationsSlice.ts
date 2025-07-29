import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationService } from "../services/NotificationService";
import {
    FetchNotificationsOptions,
    GroupedNotification,
    GroupingOptions,
    Notification,
    NotificationsState,
} from "../types";

// Initial state
const initialState: NotificationsState = {
    items: [],
    groupedItems: [],
    loading: false,
    refreshing: false,
    loadingMore: false,
    error: null,
    hasMore: true,
    nextCursor: null,
    unreadCount: 0,
    lastFetch: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async (params: { userId: string; options?: FetchNotificationsOptions }) => {
        const { userId, options } = params;
        return await NotificationService.fetchNotifications(userId, options);
    },
);

export const refreshNotifications = createAsyncThunk(
    "notifications/refreshNotifications",
    async (userId: string) => {
        return await NotificationService.fetchNotifications(userId, {
            cursor: null,
        });
    },
);

export const loadMoreNotifications = createAsyncThunk(
    "notifications/loadMoreNotifications",
    async (params: { userId: string; cursor: string }) => {
        const { userId, cursor } = params;
        return await NotificationService.fetchNotifications(userId, { cursor });
    },
);

export const markNotificationsAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (params: { userId: string; notificationIds: number[] }) => {
        const { userId, notificationIds } = params;
        const response = await NotificationService.markAsRead(
            userId,
            notificationIds,
        );
        return { ...response, notificationIds };
    },
);

export const markAllNotificationsAsRead = createAsyncThunk(
    "notifications/markAllAsRead",
    async (userId: string) => {
        const response = await NotificationService.markAllAsRead(userId);
        return response;
    },
);

export const deleteNotification = createAsyncThunk(
    "notifications/deleteNotification",
    async (params: { userId: string; notificationId: number }) => {
        const { userId, notificationId } = params;
        await NotificationService.deleteNotification(userId, notificationId);
        return notificationId;
    },
);

// Utility function to group notifications
const groupNotifications = (
    notifications: Notification[],
    options: GroupingOptions = { maxGroupSize: 5, groupTimeWindow: 24 },
): GroupedNotification[] => {
    const groups = new Map<string, GroupedNotification>();

    notifications.forEach((notification) => {
        // Create grouping key based on type, post_id, and comment_id
        const groupKey = `${notification.notification_type}-${
            notification.post_id || "null"
        }-${notification.comment_id || "null"}`;

        const existing = groups.get(groupKey);

        if (existing && existing.actors.length < options.maxGroupSize) {
            // Check if within time window
            const timeDiff = new Date(existing.latest_created_at).getTime() -
                new Date(notification.created_at).getTime();
            const hoursDiff = Math.abs(timeDiff) / (1000 * 60 * 60);

            if (hoursDiff <= options.groupTimeWindow) {
                // Add to existing group
                existing.actors.push({
                    id: notification.actor_id,
                    username: notification.actor?.username || "",
                    full_name: notification.actor?.full_name || null,
                    avatar_url: notification.actor?.avatar_url || null,
                });
                existing.count += 1;
                existing.read = existing.read && notification.read;
                if (notification.created_at > existing.latest_created_at) {
                    existing.latest_created_at = notification.created_at;
                }
                return;
            }
        }

        // Create new group
        groups.set(groupKey, {
            id: `${groupKey}-${notification.created_at}`,
            type: notification.notification_type,
            post_id: notification.post_id,
            comment_id: notification.comment_id,
            actors: [{
                id: notification.actor_id,
                username: notification.actor?.username || "",
                full_name: notification.actor?.full_name || null,
                avatar_url: notification.actor?.avatar_url || null,
            }],
            latest_created_at: notification.created_at,
            read: notification.read,
            count: 1,
            post: notification.post,
            comment: notification.comment,
        });
    });

    return Array.from(groups.values()).sort((a, b) =>
        new Date(b.latest_created_at).getTime() -
        new Date(a.latest_created_at).getTime()
    );
};

// Slice
const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetState: () => initialState,
        updateUnreadCount: (state, action: PayloadAction<number>) => {
            state.unreadCount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.groupedItems = groupNotifications(action.payload.data);
                state.hasMore = action.payload.hasMore;
                state.nextCursor = action.payload.nextCursor;
                state.unreadCount = action.payload.unreadCount;
                state.lastFetch = Date.now();
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ||
                    "Failed to fetch notifications";
            })
            // Refresh notifications
            .addCase(refreshNotifications.pending, (state) => {
                state.refreshing = true;
                state.error = null;
            })
            .addCase(refreshNotifications.fulfilled, (state, action) => {
                state.refreshing = false;
                state.items = action.payload.data;
                state.groupedItems = groupNotifications(action.payload.data);
                state.hasMore = action.payload.hasMore;
                state.nextCursor = action.payload.nextCursor;
                state.unreadCount = action.payload.unreadCount;
                state.lastFetch = Date.now();
            })
            .addCase(refreshNotifications.rejected, (state, action) => {
                state.refreshing = false;
                state.error = action.error.message ||
                    "Failed to refresh notifications";
            })
            // Load more notifications
            .addCase(loadMoreNotifications.pending, (state) => {
                state.loadingMore = true;
            })
            .addCase(loadMoreNotifications.fulfilled, (state, action) => {
                state.loadingMore = false;
                state.items = [...state.items, ...action.payload.data];
                state.groupedItems = groupNotifications([
                    ...state.items,
                    ...action.payload.data,
                ]);
                state.hasMore = action.payload.hasMore;
                state.nextCursor = action.payload.nextCursor;
            })
            .addCase(loadMoreNotifications.rejected, (state, action) => {
                state.loadingMore = false;
                state.error = action.error.message ||
                    "Failed to load more notifications";
            })
            // Mark as read
            .addCase(markNotificationsAsRead.fulfilled, (state, action) => {
                const { notificationIds } = action.payload;
                state.items = state.items.map((item) =>
                    notificationIds.includes(item.id)
                        ? { ...item, read: true }
                        : item
                );
                state.groupedItems = groupNotifications(state.items);
                state.unreadCount = Math.max(
                    0,
                    state.unreadCount - notificationIds.length,
                );
            })
            // Mark all as read
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.items = state.items.map((item) => ({
                    ...item,
                    read: true,
                }));
                state.groupedItems = groupNotifications(state.items);
                state.unreadCount = 0;
            })
            // Delete notification
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const deletedId = action.payload;
                const deletedItem = state.items.find((item) =>
                    item.id === deletedId
                );

                state.items = state.items.filter((item) =>
                    item.id !== deletedId
                );
                state.groupedItems = groupNotifications(state.items);

                if (deletedItem && !deletedItem.read) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            });
    },
});

export const { clearError, resetState, updateUnreadCount } =
    notificationsSlice.actions;
export default notificationsSlice.reducer;
