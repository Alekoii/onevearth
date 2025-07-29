import { EnhancedPlugin } from "@/core/plugins/types";
import { NotificationService } from "./services/NotificationService";
import notificationsReducer from "./store/notificationsSlice";
import { NotificationList } from "./components/NotificationList";
import { NotificationCard } from "./components/NotificationCard";
import {
    NotificationBadge,
    TabNotificationBadge,
} from "./components/NotificationBadge";

export const NotificationsPlugin: EnhancedPlugin = {
    id: "notifications",
    name: "Notifications",
    version: "1.0.0",
    description:
        "Real-time notification system with grouping and management features",
    author: "OneVEarth Team",

    // Dependencies
    dependencies: [], // No dependencies required
    peerDependencies: [], // Works standalone
    conflicts: [], // No conflicts

    // UI Components available to other plugins
    components: {
        NotificationList: NotificationList,
        NotificationCard: NotificationCard,
        NotificationBadge: NotificationBadge,
        TabNotificationBadge: TabNotificationBadge,
    },

    // Redux integration
    reducers: {
        notifications: notificationsReducer,
    },

    // Services available to other plugins
    services: {
        NotificationService: NotificationService,
    },

    // Plugin configuration schema
    configSchema: {
        type: "object",
        properties: {
            maxNotifications: {
                type: "number",
                minimum: 10,
                maximum: 10000,
                description: "Maximum number of notifications to store locally",
            },
            groupSimilar: {
                type: "boolean",
                description: "Whether to group similar notifications together",
            },
            autoMarkRead: {
                type: "boolean",
                description:
                    "Automatically mark notifications as read when viewed",
            },
            showAvatars: {
                type: "boolean",
                description: "Show user avatars in notification cards",
            },
            notificationTypes: {
                type: "object",
                properties: {
                    new_reaction: { type: "boolean" },
                    new_comment: { type: "boolean" },
                    new_mention: { type: "boolean" },
                    new_follower: { type: "boolean" },
                },
                description: "Enable/disable specific notification types",
            },
        },
    },

    // Default configuration
    defaultConfig: {
        maxNotifications: 1000,
        groupSimilar: true,
        autoMarkRead: false,
        showAvatars: true,
        notificationTypes: {
            new_reaction: true,
            new_comment: true,
            new_mention: true,
            new_follower: true,
        },
    },

    // Plugin installation
    async install(api) {
        console.log("Installing Notifications plugin...");

        // Register services
        api.registerService("NotificationService", NotificationService);

        // Register Redux reducer
        api.registerReducer("notifications", notificationsReducer);

        // Register components for use by other plugins
        api.registerComponent("NotificationList", NotificationList);
        api.registerComponent("NotificationCard", NotificationCard);
        api.registerComponent("NotificationBadge", NotificationBadge);
        api.registerComponent("TabNotificationBadge", TabNotificationBadge);

        console.log("Notifications plugin installed successfully");
    },

    // Plugin activation
    async activate(api) {
        console.log("Activating Notifications plugin...");

        // Register the main notification list in the notifications screen
        api.registerExtension("notifications.content", NotificationList, 100);

        // Listen to relevant events from other plugins
        api.subscribeToEvent(
            "user:login",
            (userData: { id: string; email?: string }) => {
                console.log(
                    "Notifications plugin: User logged in, ready to fetch notifications",
                );
            },
        );

        api.subscribeToEvent("user:logout", () => {
            console.log(
                "Notifications plugin: User logged out, clearing notification state",
            );
            // Could dispatch a reset action here if needed
        });

        // Listen to post events to potentially refresh notifications
        api.subscribeToEvent(
            "post:created",
            (data: { postId: number; userId: string }) => {
                console.log(
                    "Notifications plugin: New post created, other users may get notifications",
                );
            },
        );

        api.subscribeToEvent(
            "post:reaction",
            (
                data: { postId: number; userId: string; reactionType: string },
            ) => {
                console.log(
                    "Notifications plugin: Post reaction, may trigger notification",
                );
            },
        );

        api.subscribeToEvent(
            "comment:created",
            (data: { commentId: number; postId: number; userId: string }) => {
                console.log(
                    "Notifications plugin: Comment created, may trigger notification",
                );
            },
        );

        console.log("Notifications plugin activated successfully");
    },

    // Plugin deactivation
    async deactivate(api) {
        console.log("Deactivating Notifications plugin...");

        // Unregister extensions
        // Note: The plugin system should handle this automatically

        console.log("Notifications plugin deactivated");
    },

    // Plugin uninstallation
    async uninstall(api) {
        console.log("Uninstalling Notifications plugin...");

        // Clean up any persistent data if needed
        // The plugin system should handle component/service cleanup

        console.log("Notifications plugin uninstalled");
    },
};

// Export components for direct use if needed
export { NotificationList } from "./components/NotificationList";
export { NotificationCard } from "./components/NotificationCard";
export {
    NotificationBadge,
    TabNotificationBadge,
} from "./components/NotificationBadge";
export { useNotifications } from "./hooks/useNotifications";
export { NotificationService } from "./services/NotificationService";

// Export types for other plugins to use
export type {
    GroupedNotification,
    Notification,
    NotificationCardProps,
    NotificationListProps,
    NotificationsConfig,
    NotificationsState,
} from "./types";
