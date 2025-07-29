import type { EnhancedPlugin } from "@/core/plugins/PluginManager";
import { NotificationService } from "./services/NotificationService";
import notificationsReducer from "./store/notificationsSlice";
import {
    NotificationBadge,
    TabNotificationBadge,
} from "./components/NotificationBadge";
import { NotificationItem } from "./components/NotificationItem";
import { NotificationList } from "./components/NotificationList";

export const NotificationsPlugin: EnhancedPlugin = {
    id: "notifications",
    name: "Notifications",
    version: "1.0.0",
    description: "Real-time notification system with badges and management",
    author: "OneVEarth Team",

    dependencies: [],
    peerDependencies: ["posts", "comments"],
    conflicts: [],

    components: {
        NotificationBadge: NotificationBadge,
        TabNotificationBadge: TabNotificationBadge,
        NotificationItem: NotificationItem,
        NotificationList: NotificationList,
    },

    reducers: {
        notifications: notificationsReducer,
    },

    services: {
        NotificationService: NotificationService,
    },

    configSchema: {
        type: "object",
        properties: {
            push: { type: "boolean" },
            email: { type: "boolean" },
            inApp: { type: "boolean" },
            digestFrequency: {
                type: "string",
                enum: ["none", "daily", "weekly"],
            },
            autoRefresh: { type: "boolean" },
            pollInterval: { type: "number", minimum: 10000 },
            maxBadgeCount: { type: "number", minimum: 1, maximum: 999 },
            groupSimilar: { type: "boolean" },
            soundEnabled: { type: "boolean" },
        },
    },

    defaultConfig: {
        push: true,
        email: false,
        inApp: true,
        digestFrequency: "none",
        autoRefresh: true,
        pollInterval: 60000,
        maxBadgeCount: 99,
        groupSimilar: false,
        soundEnabled: true,
    },

    async install(api) {
        console.log("Installing Notifications plugin...");

        api.registerService("NotificationService", NotificationService);
        api.registerReducer("notifications", notificationsReducer);

        api.registerComponent("NotificationBadge", NotificationBadge);
        api.registerComponent("TabNotificationBadge", TabNotificationBadge);
        api.registerComponent("NotificationItem", NotificationItem);
        api.registerComponent("NotificationList", NotificationList);

        console.log("Notifications plugin installed successfully");
    },

    async activate(api) {
        console.log("Activating Notifications plugin...");

        api.registerExtension("notifications.content", NotificationList, 100);

        api.subscribeToEvent("user:login", (userData: { id: string }) => {
            console.log("Notifications plugin: User logged in", userData.id);
        });

        api.subscribeToEvent("user:logout", () => {
            console.log("Notifications plugin: User logged out");
        });

        api.subscribeToEvent(
            "post:created",
            (data: { postId: number; userId: string }) => {
                console.log(
                    "Notifications plugin: New post created",
                    data.postId,
                );
            },
        );

        api.subscribeToEvent("comment:created", async (data: {
            commentId: number;
            postId: number;
            authorId: string;
            postAuthorId: string;
            parentCommentId?: number;
        }) => {
            console.log(
                "Notifications plugin: Comment created",
                data.commentId,
            );

            try {
                if (data.parentCommentId) {
                    await NotificationService.createNotification({
                        recipient_id: data.postAuthorId,
                        actor_id: data.authorId,
                        notification_type: "comment_reply",
                        post_id: data.postId,
                        comment_id: data.commentId,
                    });
                } else {
                    await NotificationService.createNotification({
                        recipient_id: data.postAuthorId,
                        actor_id: data.authorId,
                        notification_type: "post_comment",
                        post_id: data.postId,
                        comment_id: data.commentId,
                    });
                }
            } catch (error) {
                console.error("Failed to create comment notification:", error);
            }
        });

        api.subscribeToEvent("user:followed", async (data: {
            followerId: string;
            followedId: string;
        }) => {
            console.log("Notifications plugin: User followed", data.followedId);

            try {
                await NotificationService.createNotification({
                    recipient_id: data.followedId,
                    actor_id: data.followerId,
                    notification_type: "user_follow",
                });
            } catch (error) {
                console.error("Failed to create follow notification:", error);
            }
        });

        api.emitEvent("notifications:ready", {
            pluginId: "notifications",
            timestamp: Date.now(),
            features: {
                realTimeUpdates: false,
                pushNotifications: false,
                emailDigests: false,
            },
        });

        console.log("Notifications plugin activated successfully");
    },

    async deactivate(api) {
        console.log("Deactivating Notifications plugin...");

        api.emitEvent("notifications:deactivated", {
            pluginId: "notifications",
            timestamp: Date.now(),
        });

        console.log("Notifications plugin deactivated");
    },

    async uninstall(api) {
        console.log("Uninstalling Notifications plugin...");
        console.log("Notifications plugin uninstalled");
    },
};

export * from "./types";
export * from "./components/NotificationBadge";
export * from "./components/NotificationItem";
export * from "./components/NotificationList";
export * from "./hooks/useNotifications";
export * from "./services/NotificationService";
