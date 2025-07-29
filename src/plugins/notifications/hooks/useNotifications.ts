import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAuth } from "@/hooks/useAuth";
import {
    clearError,
    fetchNotifications,
    fetchUnreadCount,
    loadMoreNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../store/notificationsSlice";
import { UseNotificationsOptions } from "../types";

const selectNotifications = (state: any) => state.notifications?.items || [];
const selectLoading = (state: any) => state.notifications?.loading || false;
const selectRefreshing = (state: any) =>
    state.notifications?.refreshing || false;
const selectLoadingMore = (state: any) =>
    state.notifications?.loadingMore || false;
const selectError = (state: any) => state.notifications?.error;
const selectPaginationError = (state: any) =>
    state.notifications?.paginationError;
const selectHasMore = (state: any) => state.notifications?.hasMore ?? true;
const selectNextCursor = (state: any) => state.notifications?.nextCursor;
const selectUnreadCount = (state: any) => state.notifications?.unreadCount || 0;
const selectLastRefresh = (state: any) => state.notifications?.lastRefresh;

export const useNotifications = (options: UseNotificationsOptions = {}) => {
    const { autoRefresh = false, pollInterval = 60000 } = options;

    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const notifications = useAppSelector(selectNotifications);
    const loading = useAppSelector(selectLoading);
    const refreshing = useAppSelector(selectRefreshing);
    const loadingMore = useAppSelector(selectLoadingMore);
    const error = useAppSelector(selectError);
    const paginationError = useAppSelector(selectPaginationError);
    const hasMore = useAppSelector(selectHasMore);
    const nextCursor = useAppSelector(selectNextCursor);
    const unreadCount = useAppSelector(selectUnreadCount);
    const lastRefresh = useAppSelector(selectLastRefresh);

    const fetchNotificationsAction = useCallback(() => {
        if (user?.id) {
            dispatch(fetchNotifications({ userId: user.id, refresh: false }));
        }
    }, [dispatch, user?.id]);

    const refreshNotifications = useCallback(() => {
        if (user?.id) {
            dispatch(fetchNotifications({ userId: user.id, refresh: true }));
        }
    }, [dispatch, user?.id]);

    const loadMoreNotificationsAction = useCallback(() => {
        if (user?.id && nextCursor && hasMore && !loadingMore) {
            dispatch(
                loadMoreNotifications({ userId: user.id, cursor: nextCursor }),
            );
        }
    }, [dispatch, user?.id, nextCursor, hasMore, loadingMore]);

    const markAsRead = useCallback((notificationId: number) => {
        dispatch(markNotificationAsRead(notificationId));
    }, [dispatch]);

    const markAllAsRead = useCallback(() => {
        if (user?.id) {
            dispatch(markAllNotificationsAsRead(user.id));
        }
    }, [dispatch, user?.id]);

    const updateUnreadCount = useCallback(() => {
        if (user?.id) {
            dispatch(fetchUnreadCount(user.id));
        }
    }, [dispatch, user?.id]);

    const clearErrors = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (autoRefresh && user?.id) {
            const interval = setInterval(() => {
                updateUnreadCount();

                if (lastRefresh && Date.now() - lastRefresh > pollInterval) {
                    refreshNotifications();
                }
            }, pollInterval);

            return () => clearInterval(interval);
        }
    }, [
        autoRefresh,
        user?.id,
        updateUnreadCount,
        refreshNotifications,
        lastRefresh,
        pollInterval,
    ]);

    useEffect(() => {
        if (user?.id && !loading && notifications.length === 0) {
            updateUnreadCount();
        }
    }, [user?.id, updateUnreadCount, loading, notifications.length]);

    return {
        notifications,
        loading,
        refreshing,
        loadingMore,
        error,
        paginationError,
        hasMore,
        unreadCount,
        fetchNotifications: fetchNotificationsAction,
        refreshNotifications,
        loadMoreNotifications: loadMoreNotificationsAction,
        markAsRead,
        markAllAsRead,
        updateUnreadCount,
        clearErrors,
    };
};
