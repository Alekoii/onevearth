import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/core/theming/ThemeProvider";
import { Icon } from "@/components/ui/Icon";
import { NotificationService } from "../services/NotificationService";
import { NotificationItemProps } from "../types";

export const NotificationItem = ({
    notification,
    onPress,
    onMarkAsRead,
}: NotificationItemProps) => {
    const { theme } = useTheme();

    const handlePress = () => {
        if (!notification.read && onMarkAsRead) {
            onMarkAsRead(notification.id);
        }
        onPress?.(notification);
    };

    const getNotificationIcon = () => {
        switch (notification.notification_type) {
            case "post_like":
                return (
                    <Icon
                        name="heart"
                        size={16}
                        color={theme.colors.error[500]}
                    />
                );
            case "post_comment":
            case "comment_reply":
                return (
                    <Icon
                        name="bell"
                        size={16}
                        color={theme.colors.primary[500]}
                    />
                );
            case "user_follow":
                return (
                    <Icon
                        name="bell"
                        size={16}
                        color={theme.colors.success[500]}
                    />
                );
            case "post_mention":
            case "comment_mention":
                return (
                    <Icon
                        name="bell"
                        size={16}
                        color={theme.colors.warning[500]}
                    />
                );
            default:
                return (
                    <Icon
                        name="bell"
                        size={16}
                        color={theme.colors.text.secondary}
                    />
                );
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000,
        );

        if (diffInSeconds < 60) return "now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)}h`;
        }
        if (diffInSeconds < 604800) {
            return `${Math.floor(diffInSeconds / 86400)}d`;
        }
        return `${Math.floor(diffInSeconds / 604800)}w`;
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={{
                flexDirection: "row",
                padding: theme.spacing.md,
                backgroundColor: notification.read
                    ? theme.colors.surface.primary
                    : theme.colors.surface.secondary,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border.primary,
            }}
        >
            <View style={{ marginRight: theme.spacing.sm }}>
                {notification.profiles?.avatar_url
                    ? (
                        <Image
                            source={{ uri: notification.profiles.avatar_url }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                            }}
                        />
                    )
                    : (
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: theme.colors.surface.tertiary,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Icon
                                name="user"
                                size={20}
                                color={theme.colors.text.secondary}
                            />
                        </View>
                    )}
            </View>

            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 4,
                    }}
                >
                    {getNotificationIcon()}
                    <Text
                        style={{
                            marginLeft: theme.spacing.xs,
                            color: theme.colors.text.primary,
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: notification.read ? "400" : "600",
                        }}
                    >
                        {NotificationService.formatNotificationText(
                            notification,
                        )}
                    </Text>
                </View>

                <Text
                    style={{
                        color: theme.colors.text.secondary,
                        fontSize: theme.typography.fontSize.xs,
                    }}
                >
                    {formatTimeAgo(notification.created_at)}
                </Text>
            </View>

            {!notification.read && (
                <View
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: theme.colors.primary[500],
                        marginLeft: theme.spacing.xs,
                        alignSelf: "center",
                    }}
                />
            )}
        </TouchableOpacity>
    );
};

// Re-exports
export * from "../types";
