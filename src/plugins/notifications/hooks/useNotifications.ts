import { useCallback, useEffect, useMemo } from "react";
import { useEnhancedPlugins } from "@/core/plugins/PluginProvider";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDynamicSelector } from "@/hooks/useDynamicSelector";
import {
    clearError,
    deleteNotification as deleteNotificationAction,
    fetchNotifications,
    loadMoreNotifications,
    markAllNotificationsAsRead,
    markNotificationsAsRead,
    refreshNotifications,
} from "../store/notificationsSlice";
import { NotificationsState, UseNotificationsReturn } from "../types";

export const useNotifications = (
    skipInitialLoad = false,
): UseNotificationsReturn => {
    const { pluginManager } = useEnhancedPlugins();
    const store = pluginManager.getStore();

    // Get current user from auth state
    const currentUser = useAppSelector((state) => state.auth.user);

    // Default state in case the reducer isn't loaded yet
    const defaultState: NotificationsState = {
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

    // Use dynamic selector to access notifications state
    const state = useDynamicSelector<NotificationsState>(
        "notifications",
        defaultState,
    );

    // Load initial notifications
    useEffect(() => {
        if (
            !skipInitialLoad && currentUser?.id && !state.items.length &&
            !state.loading && store
        ) {
            store.dispatch(fetchNotifications({
                userId: currentUser.id,
                options: { limit: 20 },
            }));
        }
    }, [
        skipInitialLoad,
        currentUser?.id,
        state.items.length,
        state.loading,
        store,
    ]);

    // Actions
    const refresh = useCallback(async () => {
        if (!currentUser?.id || !store) return;

        try {
            await store.dispatch(refreshNotifications(currentUser.id)).unwrap();
        } catch (error) {
            console.error("Failed to refresh notifications:", error);
        }
    }, [currentUser?.id, store]);

    const loadMore = useCallback(async () => {
        if (!currentUser?.id || !store || !state.hasMore || state.loadingMore) {
            return;
        }

        try {
            await store.dispatch(loadMoreNotifications({
                userId: currentUser.id,
                cursor: state.nextCursor || "",
            })).unwrap();
        } catch (error) {
            console.error("Failed to load more notifications:", error);
        }
    }, [
        currentUser?.id,
        store,
        state.hasMore,
        state.loadingMore,
        state.nextCursor,
    ]);

    const markAsRead = useCallback(async (notificationIds: number[]) => {
        if (!currentUser?.id || !store) return;

        try {
            await store.dispatch(markNotificationsAsRead({
                userId: currentUser.id,
                notificationIds,
            })).unwrap();
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    }, [currentUser?.id, store]);

    const markAllAsRead = useCallback(async () => {
        if (!currentUser?.id || !store) return;

        try {
            await store.dispatch(markAllNotificationsAsRead(currentUser.id))
                .unwrap();
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    }, [currentUser?.id, store]);

    const deleteNotification = useCallback(async (notificationId: number) => {
        if (!currentUser?.id || !store) return;

        try {
            await store.dispatch(deleteNotificationAction({
                userId: currentUser.id,
                notificationId,
            })).unwrap();
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    }, [currentUser?.id, store]);

    const clearNotificationError = useCallback(() => {
        if (!store) return;
        store.dispatch(clearError());
    }, [store]);

    const hasUnreadNotifications = useCallback(() => {
        return state.unreadCount > 0;
    }, [state.unreadCount]);

    // Memoize the return value to prevent unnecessary re-renders
    const returnValue = useMemo((): UseNotificationsReturn => ({
        notifications: state.groupedItems,
        unreadCount: state.unreadCount,
        loading: state.loading,
        refreshing: state.refreshing,
        error: state.error,
        hasMore: state.hasMore,
        refresh,
        loadMore,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearError: clearNotificationError,
        hasUnreadNotifications,
    }), [
        state.groupedItems,
        state.unreadCount,
        state.loading,
        state.refreshing,
        state.error,
        state.hasMore,
        refresh,
        loadMore,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearNotificationError,
        hasUnreadNotifications,
    ]);

    return returnValue;
};
