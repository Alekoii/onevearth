export interface Notification {
    id: number;
    recipient_id: string;
    actor_id: string;
    notification_type: NotificationType;
    post_id: number | null;
    comment_id: number | null;
    read: boolean;
    created_at: string;

    profiles?: {
        username: string;
        avatar_url: string | null;
        full_name: string | null;
    };
}

export type NotificationType =
    | "post_like"
    | "post_comment"
    | "comment_reply"
    | "user_follow"
    | "post_mention"
    | "comment_mention";

export interface NotificationsState {
    items: Notification[];
    loading: boolean;
    refreshing: boolean;
    loadingMore: boolean;
    error: string | null;
    paginationError: string | null;
    hasMore: boolean;
    nextCursor: string | null;
    unreadCount: number;
    lastRefresh: number | null;
}

export interface CreateNotificationData {
    recipient_id: string;
    actor_id: string;
    notification_type: NotificationType;
    post_id?: number;
    comment_id?: number;
}

export interface NotificationItemProps {
    notification: Notification;
    onPress?: (notification: Notification) => void;
    onMarkAsRead?: (notificationId: number) => void;
}

export interface NotificationListProps {
    autoRefresh?: boolean;
    onNotificationPress?: (notification: Notification) => void;
}

export interface NotificationBadgeProps {
    showZero?: boolean;
    maxCount?: number;
}

export interface UseNotificationsOptions {
    autoRefresh?: boolean;
    pollInterval?: number;
}
