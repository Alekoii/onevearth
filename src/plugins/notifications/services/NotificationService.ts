import { supabase } from "@/core/api/SupabaseClient";
import {
    FetchNotificationsOptions,
    MarkReadResponse,
    Notification,
    NotificationError,
    NotificationResponse,
    RawNotification,
} from "../types";

export class NotificationService {
    private static DEFAULT_LIMIT = 20;

    /**
     * Fetch notifications for the current user
     */
    static async fetchNotifications(
        userId: string,
        options: FetchNotificationsOptions = {},
    ): Promise<NotificationResponse> {
        try {
            const {
                limit = this.DEFAULT_LIMIT,
                cursor = null,
                unreadOnly = false,
            } = options;

            let query = supabase
                .from("notifications")
                .select(`
                    id,
                    recipient_id,
                    actor_id,
                    notification_type,
                    post_id,
                    comment_id,
                    read,
                    created_at,
                    actor:profiles!notifications_actor_id_fkey (
                        username,
                        full_name,
                        avatar_url
                    ),
                    post:posts (
                        id,
                        content,
                        user_id
                    ),
                    comment:comments (
                        id,
                        content,
                        post_id
                    )
                `)
                .eq("recipient_id", userId)
                .order("created_at", { ascending: false })
                .limit(limit + 1); // Fetch one extra to check if there's more

            // Add cursor-based pagination
            if (cursor) {
                query = query.lt("created_at", cursor);
            }

            // Filter for unread only if requested
            if (unreadOnly) {
                query = query.eq("read", false);
            }

            const { data, error } = await query;

            if (error) {
                throw this.createError("FETCH_FAILED", error.message, error);
            }

            if (!data) {
                return {
                    data: [],
                    hasMore: false,
                    nextCursor: null,
                    unreadCount: 0,
                };
            }

            // Check if there are more items
            const hasMore = data.length > limit;
            const notifications = hasMore ? data.slice(0, -1) : data;
            const nextCursor = hasMore
                ? notifications[notifications.length - 1]?.created_at
                : null;

            // Get unread count separately for efficiency
            const unreadCount = await this.getUnreadCount(userId);

            return {
                data: this.processRawNotifications(
                    notifications as RawNotification[],
                ),
                hasMore,
                nextCursor,
                unreadCount,
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get count of unread notifications
     */
    static async getUnreadCount(userId: string): Promise<number> {
        try {
            const { count, error } = await supabase
                .from("notifications")
                .select("*", { count: "exact", head: true })
                .eq("recipient_id", userId)
                .eq("read", false);

            if (error) {
                throw this.createError("COUNT_FAILED", error.message, error);
            }

            return count || 0;
        } catch (error) {
            console.warn("Failed to get unread count:", error);
            return 0; // Fail silently for count
        }
    }

    /**
     * Mark notifications as read
     */
    static async markAsRead(
        userId: string,
        notificationIds: number[],
    ): Promise<MarkReadResponse> {
        try {
            const { data, error } = await supabase
                .from("notifications")
                .update({ read: true })
                .eq("recipient_id", userId)
                .in("id", notificationIds)
                .select("id");

            if (error) {
                throw this.createError(
                    "MARK_READ_FAILED",
                    error.message,
                    error,
                );
            }

            return {
                success: true,
                updatedIds: data?.map((item) => item.id) || [],
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Mark all notifications as read
     */
    static async markAllAsRead(userId: string): Promise<MarkReadResponse> {
        try {
            const { data, error } = await supabase
                .from("notifications")
                .update({ read: true })
                .eq("recipient_id", userId)
                .eq("read", false)
                .select("id");

            if (error) {
                throw this.createError(
                    "MARK_ALL_READ_FAILED",
                    error.message,
                    error,
                );
            }

            return {
                success: true,
                updatedIds: data?.map((item) => item.id) || [],
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Delete a notification
     */
    static async deleteNotification(
        userId: string,
        notificationId: number,
    ): Promise<void> {
        try {
            const { error } = await supabase
                .from("notifications")
                .delete()
                .eq("recipient_id", userId)
                .eq("id", notificationId);

            if (error) {
                throw this.createError("DELETE_FAILED", error.message, error);
            }
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Delete all read notifications (cleanup)
     */
    static async deleteReadNotifications(userId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from("notifications")
                .delete()
                .eq("recipient_id", userId)
                .eq("read", true);

            if (error) {
                throw this.createError("CLEANUP_FAILED", error.message, error);
            }
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Process raw notifications from Supabase (convert arrays to single objects)
     */
    private static processRawNotifications(
        rawNotifications: RawNotification[],
    ): Notification[] {
        return rawNotifications.map((raw) => ({
            id: raw.id,
            recipient_id: raw.recipient_id,
            actor_id: raw.actor_id,
            notification_type: raw.notification_type,
            post_id: raw.post_id,
            comment_id: raw.comment_id,
            read: raw.read,
            created_at: raw.created_at,

            // Convert arrays to single objects (take first item)
            actor: raw.actor && raw.actor.length > 0 ? raw.actor[0] : undefined,
            post: raw.post && raw.post.length > 0 ? raw.post[0] : undefined,
            comment: raw.comment && raw.comment.length > 0
                ? raw.comment[0]
                : undefined,
        }));
    }

    /**
     * Create a standardized error
     */
    private static createError(
        code: string,
        message: string,
        details?: any,
    ): NotificationError {
        return {
            code,
            message,
            details,
        };
    }

    /**
     * Handle and transform errors
     */
    private static handleError(error: any): NotificationError {
        if (error.code) {
            return error; // Already a NotificationError
        }

        return this.createError(
            "UNKNOWN_ERROR",
            error.message || "An unexpected error occurred",
            error,
        );
    }
}
