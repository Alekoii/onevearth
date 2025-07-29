import { Database } from "@/types/database";

// Base notification type from database
export type NotificationType = Database["public"]["Enums"]["notification_type"];

// Raw notification from Supabase (with array joins)
export interface RawNotification {
    id: number;
    recipient_id: string;
    actor_id: string;
    notification_type: NotificationType;
    post_id: number | null;
    comment_id: number | null;
    read: boolean;
    created_at: string;

    // Supabase returns arrays for foreign key relationships
    actor: Array<{
        username: string;
        full_name: string | null;
        avatar_url: string | null;
    }>;
    post: Array<{
        id: number;
        content: string | null;
        user_id: string;
    }>;
    comment: Array<{
        id: number;
        content: string;
        post_id: number;
    }>;
}

// Processed notification with single objects
export interface Notification {
    id: number;
    recipient_id: string;
    actor_id: string;
    notification_type: NotificationType;
    post_id: number | null;
    comment_id: number | null;
    read: boolean;
    created_at: string;

    // Related data from joins (single objects)
    actor?: {
        username: string;
        full_name: string | null;
        avatar_url: string | null;
    };
    post?: {
        id: number;
        content: string | null;
        user_id: string;
    };
    comment?: {
        id: number;
        content: string;
        post_id: number;
    };
}

// Grouped notifications for better UX
export interface GroupedNotification {
    id: string; // Composite ID for grouping
    type: NotificationType;
    post_id: number | null;
    comment_id: number | null;
    actors: Array<{
        id: string;
        username: string;
        full_name: string | null;
        avatar_url: string | null;
    }>;
    latest_created_at: string;
    read: boolean;
    count: number;
    post?: {
        id: number;
        content: string | null;
        user_id: string;
    };
    comment?: {
        id: number;
        content: string;
        post_id: number;
    };
}

// Redux state shape
export interface NotificationsState {
    items: Notification[];
    groupedItems: GroupedNotification[];
    loading: boolean;
    refreshing: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    nextCursor: string | null;
    unreadCount: number;
    lastFetch: number | null;
}

// API response types
export interface NotificationResponse {
    data: Notification[];
    hasMore: boolean;
    nextCursor: string | null;
    unreadCount: number;
}

export interface MarkReadResponse {
    success: boolean;
    updatedIds: number[];
}

// Hook return type
export interface UseNotificationsReturn {
    notifications: GroupedNotification[];
    unreadCount: number;
    loading: boolean;
    refreshing: boolean;
    error: string | null;
    hasMore: boolean;

    // Actions
    refresh: () => Promise<void>;
    loadMore: () => Promise<void>;
    markAsRead: (notificationIds: number[]) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (notificationId: number) => Promise<void>;
}

// Component props
export interface NotificationCardProps {
    notification: GroupedNotification;
    onPress?: (notification: GroupedNotification) => void;
    onMarkRead?: (notificationIds: number[]) => void;
    onDelete?: (notificationId: number) => void;
}

export interface NotificationListProps {
    onNotificationPress?: (notification: GroupedNotification) => void;
    EmptyComponent?: React.ComponentType;
    refreshing?: boolean;
    onRefresh?: () => void;
}

// Plugin configuration
export interface NotificationsConfig {
    maxNotifications: number;
    groupSimilar: boolean;
    autoMarkRead: boolean;
    showAvatars: boolean;
    notificationTypes: Record<NotificationType, boolean>;
}

// Error types
export interface NotificationError {
    code: string;
    message: string;
    details?: any;
}

// Utility types for service
export interface FetchNotificationsOptions {
    limit?: number;
    cursor?: string | null;
    unreadOnly?: boolean;
}

export interface GroupingOptions {
    maxGroupSize: number;
    groupTimeWindow: number; // hours
}
