import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import {
    clearError,
    deleteNotification,
    fetchNotifications,
    loadMoreNotifications,
    markAllNotificationsAsRead,
    markNotificationsAsRead,
    refreshNotifications,
} from "../store/notificationsSlice";
import { FetchNotificationsOptions, UseNotificationsReturn } from "../types";

export const useNotifications = (
    autoFetch: boolean = true,
    options?: FetchNotificationsOptions,
): UseNotificationsReturn => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    // Select state from Redux store
    const {
        groupedItems,
        loading,
        refreshing,
        loadingMore,
        error,
        hasMore,
        nextCursor,
        unreadCount,
        lastFetch,
    } = useAppSelector((state) => state.notifications);

    // Auto-fetch notifications on mount if user is authenticated
    useEffect(() => {
        if (autoFetch && user?.id && !lastFetch && !loading) {
            handleFetch();
        }
    }, [autoFetch, user?.id, lastFetch, loading]);

    // Clear error when component unmounts or user changes
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch, user?.id]);

    /**
     * Fetch initial notifications
     */
    const handleFetch = useCallback(async () => {
        if (!user?.id) return;

        try {
            await dispatch(fetchNotifications({
                userId: user.id,
                options,
            })).unwrap();
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, [dispatch, user?.id, options]);

    /**
     * Refresh notifications (pull-to-refresh)
     */
    const refresh = useCallback(async () => {
        if (!user?.id) return;

        try {
            await dispatch(refreshNotifications(user.id)).unwrap();
        } catch (error) {
            console.error("Failed to refresh notifications:", error);
        }
    }, [dispatch, user?.id]);

    /**
     * Load more notifications (infinite scroll)
     */
    const loadMore = useCallback(async () => {
        if (!user?.id || !hasMore || loadingMore || !nextCursor) return;

        try {
            await dispatch(loadMoreNotifications({
                userId: user.id,
                cursor: nextCursor,
            })).unwrap();
        } catch (error) {
            console.error("Failed to load more notifications:", error);
        }
    }, [dispatch, user?.id, hasMore, loadingMore, nextCursor]);

    /**
     * Mark specific notifications as read
     */
    const markAsRead = useCallback(async (notificationIds: number[]) => {
        if (!user?.id || notificationIds.length === 0) return;

        try {
            await dispatch(markNotificationsAsRead({
                userId: user.id,
                notificationIds,
            })).unwrap();
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    }, [dispatch, user?.id]);

    /**
     * Mark all notifications as read
     */
    const markAllAsRead = useCallback(async () => {
        if (!user?.id) return;

        try {
            await dispatch(markAllNotificationsAsRead(user.id)).unwrap();
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    }, [dispatch, user?.id]);

    /**
     * Delete a notification
     */
    const deleteNotificationItem = useCallback(
        async (notificationId: number) => {
            if (!user?.id) return;

            try {
                await dispatch(deleteNotification({
                    userId: user.id,
                    notificationId,
                })).unwrap();
            } catch (error) {
                console.error("Failed to delete notification:", error);
            }
        },
        [dispatch, user?.id],
    );

    /**
     * Clear current error
     */
    const clearCurrentError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    /**
     * Get notifications by type
     */
    const getNotificationsByType = useCallback((type: string) => {
        return groupedItems.filter((notification) =>
            notification.type === type
        );
    }, [groupedItems]);

    /**
     * Get unread notifications only
     */
    const getUnreadNotifications = useCallback(() => {
        return groupedItems.filter((notification) => !notification.read);
    }, [groupedItems]);

    /**
     * Check if there are any unread notifications
     */
    const hasUnreadNotifications = useCallback(() => {
        return unreadCount > 0;
    }, [unreadCount]);

    /**
     * Get total notification count
     */
    const getTotalCount = useCallback(() => {
        return groupedItems.length;
    }, [groupedItems]);

    return {
        // Data
        notifications: groupedItems,
        unreadCount,
        loading,
        refreshing,
        error,
        hasMore,

        // Actions
        refresh,
        loadMore,
        markAsRead,
        markAllAsRead,
        deleteNotification: deleteNotificationItem,

        // Utility methods
        clearError: clearCurrentError,
        getNotificationsByType,
        getUnreadNotifications,
        hasUnreadNotifications,
        getTotalCount,

        // Manual fetch (useful for testing or manual refresh)
        fetch: handleFetch,
    };
};
