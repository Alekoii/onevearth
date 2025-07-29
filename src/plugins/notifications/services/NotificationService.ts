import { supabase } from "@/core/api/SupabaseClient";
import {
    CreateNotificationData,
    Notification,
    NotificationType,
} from "../types";

interface PaginationResult<T> {
    data: T[];
    hasMore: boolean;
    nextCursor: string | null;
    total: number;
}

export class NotificationService {
    private static PAGE_SIZE = 20;

    static async getNotifications(
        userId: string,
        cursor?: string | null,
        limit = this.PAGE_SIZE,
    ): Promise<PaginationResult<Notification>> {
        let query = supabase
            .from("notifications")
            .select(`
                *,
                profiles!actor_id (
                    username,
                    avatar_url,
                    full_name
                )
            `)
            .eq("recipient_id", userId)
            .order("created_at", { ascending: false })
            .limit(limit + 1);

        if (cursor) {
            query = query.lt("created_at", cursor);
        }

        const { data, error } = await query;

        if (error) throw error;

        const notifications = data || [];
        const hasMore = notifications.length > limit;
        const items = hasMore ? notifications.slice(0, -1) : notifications;
        const nextCursor = hasMore ? items[items.length - 1]?.created_at : null;

        return {
            data: items,
            hasMore,
            nextCursor,
            total: items.length,
        };
    }

    static async getUnreadCount(userId: string): Promise<number> {
        const { count, error } = await supabase
            .from("notifications")
            .select("*", { count: "exact", head: true })
            .eq("recipient_id", userId)
            .eq("read", false);

        if (error) throw error;
        return count || 0;
    }

    static async markAsRead(notificationId: number): Promise<void> {
        const { error } = await supabase
            .from("notifications")
            .update({ read: true })
            .eq("id", notificationId);

        if (error) throw error;
    }

    static async markAllAsRead(userId: string): Promise<void> {
        const { error } = await supabase
            .from("notifications")
            .update({ read: true })
            .eq("recipient_id", userId)
            .eq("read", false);

        if (error) throw error;
    }

    static async createNotification(
        data: CreateNotificationData,
    ): Promise<void> {
        if (data.recipient_id === data.actor_id) return;

        const { error } = await supabase
            .from("notifications")
            .insert(data);

        if (error) throw error;
    }

    static async deleteNotification(notificationId: number): Promise<void> {
        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", notificationId);

        if (error) throw error;
    }

    static formatNotificationText(notification: Notification): string {
        const actor = notification.profiles?.username || "Someone";

        switch (notification.notification_type) {
            case "post_like":
                return `${actor} liked your post`;
            case "post_comment":
                return `${actor} commented on your post`;
            case "comment_reply":
                return `${actor} replied to your comment`;
            case "user_follow":
                return `${actor} started following you`;
            case "post_mention":
                return `${actor} mentioned you in a post`;
            case "comment_mention":
                return `${actor} mentioned you in a comment`;
            default:
                return `${actor} interacted with your content`;
        }
    }
}
